import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './../contexts/AuthContext'
import { useContext } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useContext(AuthContext)

  if (user.length === 0) {
    return <Navigate to='/' />
  }

  return children
}

export default ProtectedRoute
