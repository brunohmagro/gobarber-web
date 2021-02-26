import React, { useCallback, useRef } from 'react'
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import getValidationErrors from '../../utils/getValidationErrors'

import logoImg from '../../assets/images/logo.svg'
import { Container, Content, Background } from './styles'

import Input from '../../components/Input'
import Button from '../../components/Button'

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  // eslint-disable-next-line
  const handleSubmit = useCallback(async (data: object) => {
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
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form ref={formRef} onSubmit={handleSubmit}>
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
