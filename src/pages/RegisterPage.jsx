import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { Link, useNavigate } from 'react-router-dom'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { register, isLoading, error } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await register(username, password)
      navigate('/')
    } catch {
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-form__title">Cadastro</h1>
        <label className="auth-form__label">
          Usuário
          <input
            className="auth-form__input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
        </label>
        <label className="auth-form__label">
          Senha
          <input
            className="auth-form__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </label>
        <button className="auth-form__button" type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        {error && <p className="auth-form__error">{error}</p>}
        <p className="auth-form__link">
          Já tem conta? <Link to="/login">Faça login</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
