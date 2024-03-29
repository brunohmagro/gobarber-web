import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import { useField } from '@unform/core'

import { Container, Error } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  containerStyle?: Record<string, unknown>
  icon?: React.ComponentType<IconBaseProps>
}

const Input: React.FC<InputProps> = ({
  name,
  icon: Icon,
  containerStyle = {},
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [idFocus, setIsFocus] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const { fieldName, defaultValue, error, registerField } = useField(name)

  const handleInputFocus = useCallback(() => {
    setIsFocus(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocus(false)

    setIsFilled(!!(inputRef.current?.value && inputRef.current?.value.trim()))
  }, [])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={idFocus}
      data-testid="input-container"
    >
      {Icon && <Icon />}
      <input
        name={name}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...props}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  )
}

export default Input
