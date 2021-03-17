import React, { ChangeEvent, useCallback, useRef } from 'react'
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'

import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api'
import { useToast } from '../../hooks/toast'
import { useAuth } from '../../hooks/auth'

import { Container, Content, AvatarInput } from './styles'

import Input from '../../components/Input'
import Button from '../../components/Button'

interface ProfileFormData {
  name: string
  email: string
  password: string
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { user, updateUser } = useAuth()

  const { addToast } = useToast()
  const history = useHistory()
  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
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

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData()
        data.append('avatar', e.target.files[0])

        api.patch('/users/avatar', data).then((response) => {
          updateUser(response.data)

          addToast({
            type: 'success',
            title: 'Avatar atualizado com sucesso',
          })
        })
      }
    },
    [addToast, updateUser],
  )

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
          <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="current_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />
          <Input
            name="confirm_password"
            icon={FiLock}
            type="password"
            placeholder="Confirmar nova senha"
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  )
}

export default Profile
