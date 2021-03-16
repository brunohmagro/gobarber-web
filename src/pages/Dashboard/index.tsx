import React from 'react'
import { FiPower } from 'react-icons/fi'

import { Container, Header, HeaderContent, Profile } from './styles'

import logoImage from '../../assets/images/logo.svg'
import { useAuth } from '../../hooks/auth'

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth()

  console.log(user.avatar_url)

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImage} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo(a),</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
    </Container>
  )
}

export default Dashboard
