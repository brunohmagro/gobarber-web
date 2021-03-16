import React, { useCallback, useRef } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { useHistory, useLocation } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'

import logoImg from '../../assets/images/logo.svg'
import { Container, Content, Background, AnimationContainer } from './styles'
import getValidationErrors from '../../utils/getValidationErrors'
import { useToast } from '../../hooks/toast'
import api from '../../services/api'

import Input from '../../components/Input'
import Button from '../../components/Button'

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()
  const history = useHistory()
  const location = useLocation()

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          password: Yup.string().min(
            6,
            'A senha deve ter no mínimo 6 caracteres',
          ),
          confirmPassword: Yup.string()
            .oneOf(
              [Yup.ref('password'), null],
              'As senhas informadas não conferem',
            )
            .required('A confirmação da senha é orbigatória'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const token = location.search.replace('?token=', '')

        if (!token) {
          throw new Error()
        }

        await api.post('/password/reset', {
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        })

        addToast({
          type: 'success',
          title: 'Senha alterada com sucesso!',
          description: 'Sua senha foi alterada, redirecionando para login...',
        })

        history.push('/')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description:
            'Ocorreu um erro ao resetar sua senha, tente novamente em instantes.',
        })
      }
    },
    [addToast, history, location],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="confirmPassword"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />
            <Button type="submit">Resetar</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default ResetPassword
