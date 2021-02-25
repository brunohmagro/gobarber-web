import { shade } from 'polished'
import styled from 'styled-components'

export const Container = styled.button`
  height: 56px;
  background: #ff9000;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  color: #312e38;
  font-weight: 500;
  width: 100%;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`

export const Teste2 = styled.div``
