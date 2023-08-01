//Login/index.js
import React from 'react'
import InputGroup from '../../../components/InputGroup'
import{ Link } from 'react-router-dom'
//hooks
import { useContext, useState } from 'react'
//context
import { Context } from '../../../context/UserContext'

function Login() {
  //aqui vai a lógica para o login
  const [user, setUser] = useState({})
  const { login } = useContext(Context)

  function handleChange(e){
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  function handleSubmit(e){
    e.preventDefault()
    login(user)
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <InputGroup
          type='email'
          label='Digite seu email'
          placeholder='Seu email aqui'
          name='email'
          handleChange={handleChange}
        />
        <InputGroup
          type='password'
          label='Digite sua senha'
          placeholder='Digite sua senha'
          name='password'
          handleChange={handleChange}
        />
        <button class='btn btn-primary' type='submit'>Login</button>
      </form>
      <p>
        Não tem conta? <Link to='/register'>Crie aqui!</Link>
      </p>
    </div>
  )
}

export default Login