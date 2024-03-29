import { renderHook, act } from '@testing-library/react-hooks'
import MockAdapter from 'axios-mock-adapter'

import { AuthProvider, useAuth } from '../../hooks/auth'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: '123123',
        name: 'Joh Doe',
        email: 'johndoe@mail.com.br',
      },
      token: 'valid-token',
    }

    apiMock.onPost('/sessions').reply(200, apiResponse)

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    result.current.signIn({
      email: 'johndoe@mail.com.br',
      password: '123456',
    })

    await waitForNextUpdate()

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    )
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    )
    expect(result.current.user.email).toEqual('johndoe@mail.com.br')
  })

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'valid-token'
        case '@GoBarber:user':
          return JSON.stringify({
            id: '123123',
            name: 'Joh Doe',
            email: 'johndoe@mail.com.br',
          })

        default:
          return null
      }
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user.email).toEqual('johndoe@mail.com.br')
  })

  it('should be able to signOut', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'valid-token'
        case '@GoBarber:user':
          return JSON.stringify({
            id: '123123',
            name: 'Joh Doe',
            email: 'johndoe@mail.com.br',
          })

        default:
          return null
      }
    })

    const removeItemSpy = jest.spyOn(Storage.prototype, 'getItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.signOut()
    })

    expect(removeItemSpy).toHaveBeenCalledTimes(2)
    expect(result.current.user).toBeUndefined()
  })

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    const user = {
      id: '123123',
      name: 'Joh Doe',
      email: 'johndoe@mail.com.br',
      avatar_url: 'image.png',
    }

    act(() => {
      result.current.updateUser(user)
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    )

    expect(result.current.user).toEqual(user)
  })
})
