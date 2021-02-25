import React from 'react'
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi'
import { Form } from '@unform/web'

import logoImg from '../../assets/images/logo.svg'
import { Container, Content, Background } from './styles'

import Input from '../../components/Input'
import Button from '../../components/Button'

const SignUp: React.FC = () => {
  // eslint-disable-next-line
  function handleSubmit(data: object): void {
    // eslint-disable-next-line
    console.log(data)
  }

  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>
          <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
          <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
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

        <a href="https://">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  )
}

export default SignUp
