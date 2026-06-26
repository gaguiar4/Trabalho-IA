export function requestInterceptor(config) {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
  return config
}

export function responseInterceptor(response) {
  return response.data
}

export function errorInterceptor(error) {
  const normalized = {
    message: error.response?.data?.message || error.message || 'Erro de conexão',
    status: error.response?.status || 0,
  }
  return Promise.reject(normalized)
}
