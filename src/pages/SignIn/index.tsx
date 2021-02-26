import React, { useCallback, useRef } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'

import logoImg from '../../assets/images/logo.svg'
import { Container, Content, Background } from './styles'

import Input from '../../components/Input'
import Button from '../../components/Button'
import getValidationErrors from '../../utils/getValidationErrors'

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  // eslint-disable-next-line
  const handleSubmit = useCallback(async (data: object) => {
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
    } catch (err) {
      const errors = getValidationErrors(err)
      formRef.current?.setErrors(errors)
      // eslint-disable-next-line
      console.log(JSON.stringify(err))
      // eslint-disable-next-line
      console.log(err.inner)
    }
  }, [])

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
