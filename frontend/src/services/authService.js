import api from './api'

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.data) {
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data))
    }
    return response.data.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}

export const register = async (email, password, fullName) => {
  try {
    const response = await api.post('/auth/register', { email, password, fullName })
    return response.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}