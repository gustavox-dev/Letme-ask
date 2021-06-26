import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// importou as funções e transformou em uma função só.
export function useAuth() {
  const value = useContext(AuthContext)

  return value;
}