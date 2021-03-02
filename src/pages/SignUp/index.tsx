import React, { useCallback, useRef } from 'react'
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'

import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api'
import { useToast } from '../../hooks/toast'

import logoImg from '../../assets/images/logo.svg'
import { Container, Content, Background, AnimationContainer } from './styles'

import Input from '../../components/Input'
import Button from '../../components/Button'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()
  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          name: Yup.string().required('O campo nome é orbigatório'),
          email: Yup.string()
            .required('O campo e-mail é obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(
            6,
            'A senha deve ter no mínimo 6 caracteres',
          ),
          confirm_password: Yup.string()
            .oneOf(
              [Yup.ref('password'), null],
              'As senhas informadas não conferem',
            )
            .required('A confirmação da senha é orbigatória'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await api.post('/users', data)

        history.push('/')

        addToast({
          type: 'success',
          title: 'Obaa, deu tudo certo!',
          description: 'Você já pode fazer seu logon no GoBarber!',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }

        addToast({
          type: 'error',
          title: 'Opss...Erro no cadastro',
          description: 'Ocorreu um erro ao efetuar o cadastro, tente novamente',
        })
      }
    },
    [addToast, history],
  )

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Input
              name="confirm_password"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />
            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  )
}

export default SignUp
