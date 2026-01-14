import api from './api'

export const getProducts = async () => {
  try {
    const response = await api.get('/products')
    return response.data.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData)
    return response.data.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData)
    return response.data.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}

export const searchProducts = async (keyword) => {
  try {
    const response = await api.get('/products/search', { params: { keyword } })
    return response.data.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}

export const getLowStockProducts = async () => {
  try {
    const response = await api.get('/products/low-stock')
    return response.data.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}