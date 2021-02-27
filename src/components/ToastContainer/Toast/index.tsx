import React, { useEffect } from 'react'
import { FiAlertCircle, FiXCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'
import { ToastMessage, useToast } from '../../../hooks/toast'

import Container from './styles'

interface ToastProps {
  toast: ToastMessage
}

const icons = {
  info: <FiInfo size={25} />,
  error: <FiAlertCircle size={25} />,
  success: <FiCheckCircle size={25} />,
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast()

  useEffect(() => {
    const timerToast = setTimeout(() => {
      removeToast(toast.id)
    }, 3000)

    return () => {
      clearTimeout(timerToast)
    }
  }, [removeToast, toast.id])

  return (
    <Container type={toast.type} hasDescription={!!toast.description}>
      {icons[toast.type || 'info']}
      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>
      <button onClick={() => removeToast(toast.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  )
}

export default Toast
