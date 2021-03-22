import React from 'react'
import { render } from '@testing-library/react'

import SignIn from '../../pages/SignIn'

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
    useHistory: jest.fn(),
  }
})

describe('SignIn Page', () => {
  it('should br able to sign in', () => {
    const { debug } = render(<SignIn />)

    debug()
  })
})
