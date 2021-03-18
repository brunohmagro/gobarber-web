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
  current_password: string
  password: string
  confirm_password: string
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
          current_password: Yup.string().test(
            'empty-or-6-characters-check',
            'A senha deve ter no mínimo 6 caracteres',
            (current_password) =>
              !current_password || current_password.length >= 6,
          ),
          password: Yup.string().when('current_password', {
            is: (current_password: string) => current_password.length >= 6,
            then: Yup.string()
              .required('Campo obrigatório')
              .min(6, 'A nova senha deve ter ao menos 6 caracteres'),
          }),
          confirm_password: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'As senhas informadas não conferem',
          ),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const {
          name,
          email,
          current_password,
          password,
          confirm_password,
        } = data

        const formData = {
          name,
          email,
          ...(current_password
            ? {
                oldPassword: current_password,
                password,
                confirmPassword: confirm_password,
              }
            : {}),
        }

        const response = await api.put('/profile', formData)

        updateUser(response.data)

        history.push('/dashboard')

        addToast({
          type: 'success',
          title: 'Obaa, deu tudo certo!',
          description: 'Seu perfil foi atualizado com sucesso!',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }

        addToast({
          type: 'error',
          title: 'Opss...Erro na atualização',
          description:
            'Ocorreu um erro ao atualizar seu perfil, tente novamente',
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
