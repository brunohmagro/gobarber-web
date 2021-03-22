import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import SignIn from '../../pages/SignIn'

const mockedHistoryPush = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
  }
})

describe('SignIn Page', () => {
  it('should br able to sign in', () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'johndoe@mail.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
  })
})
