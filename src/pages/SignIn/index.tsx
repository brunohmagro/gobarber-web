import React, { useCallback, useRef } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'

import logoImg from '../../assets/images/logo.svg'
import { Container, Content, Background } from './styles'
import getValidationErrors from '../../utils/getValidationErrors'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'

import Input from '../../components/Input'
import Button from '../../components/Button'

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { signIn } = useAuth()
  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('O campo e-mail é obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('O campo senha é obrigatório'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await signIn({
          email: data.email,
          password: data.password,
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Ocorreu um erro ao fazer o login, cheque as credenciais',
        })
      }
    },
    [signIn, addToast],
  )

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu logon</h1>
          <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />
          <Button type="submit">Entrar</Button>

          <a href="https://">Esqueci minha senha</a>
        </Form>

        <a href="https://">
          <FiLogIn />
          Criar conta
        </a>
      </Content>
      <Background />
    </Container>
  )
}

export default SignIn
