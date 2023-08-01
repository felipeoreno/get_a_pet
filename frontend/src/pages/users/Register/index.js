import React from 'react'
import InputGroup from '../../../components/InputGroup'

//hooks
import { useContext, useState } from 'react'
//context
import { Context } from '../../../context/UserContext'

function Register() {
  //a lógica para enviar um formulário, ou para fazer qualquer coisa diferenciada em uma página fica neste local
  const [user, setUser] = useState({})
  const { register } = useContext(Context)

  function handleChange(evento){
    setUser({ ...user, [evento.target.name]: evento.target.value })
    //{...user}: cria uma cópia do objeto user atual, usando a sintaxe de espalhamento do javascript (...)
    //essa cópia é feita para preservar valores existentes no objeto antes de fazer qualquer alteração
  }

  function handleSubmit(evento){
    evento.preventDefault()
    register(user)
  }

  return (
    <div>
      <h2>Registrar</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <InputGroup
            type='text'
            label='Digite seu nome'
            placeholder='Seu nome aqui'
            name='name'
            handleChange={handleChange}
          />
          <InputGroup
            type='email'
            label='Digite seu email'
            placeholder='Seu email aqui'
            name='email'
            handleChange={handleChange}
          />
          <InputGroup
            type='tel'
            label='Digite seu telefone'
            placeholder='Seu telefone aqui'
            name='phone'
            handleChange={handleChange}
          />
          <InputGroup
            type='password'
            label='Digite sua senha'
            placeholder='Digite sua senha'
            name='password'
            handleChange={handleChange}
          />
          <InputGroup
            type='password'
            label='Confirme sua senha'
            placeholder='Confirme sua senha'
            name='confirmpassword'
            handleChange={handleChange}
          />
          <button class='btn btn-primary' type='submit'>Registrar</button>
        </form>
      </div>
    </div>
  )
}

export default Register