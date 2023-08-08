import React, { useState, useEffect } from 'react'
import api from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import InputGroup from '../../../components/InputGroup'

function Profile() {
  const [user, setUser] = useState({})
  const [preview, setPreview] = useState()
  const [token] = useState(localStorage.getItem('token') || '') //pega o token no local storage
  const navigate = useNavigate()

  useEffect(() => {
    if(!token){
      alert('Por favor faça login')
      navigate('/login')
    } else{
      api.get('/users/checkuser', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      })
        .then((response) => {
          // alert('response.data: ' + JSON.stringify(response.data))
          setUser(response.data)
        })
    }
  }, [token, navigate])

  function handleChange(e){
    setUser({ ...user, [e.target.name]: e.target.name })
  }

  //alterando estado da imagem
  const [image, setImage] = useState(null)

  function onFileChange(e){
    setPreview(URL.createObjectURL(e.target.files[0]))
    setImage(e.target.files[0])
  }

  async function handleSubmit(e){
    e.preventDefault()

    const formData = new FormData()
    //adiciona imagem ao formData (se ela existir)
    if(image){
      formData.append('image', image)
    }

    await Object.keys(user).forEach((key) => formData.append(key, user[key]))

    const data = await api.patch(`/users/edit/${user.id}`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        alert(err.response.data)
        return err.response.data
      })
    alert(data.message)
  }

  return (
    <div className='container'>
      <h2>Profile</h2>
      <img
        style={{ height: '200px', width: '200px' }}
        className='rounded-circle m-3'
        src={'http://localhost:5000/images/users/' + user.image}
        alt='Foto de perfil'
      />
      <form onSubmit={handleSubmit}>
        <InputGroup
          label='Imagem'
          type='file'
          name='image'
          handleChange={onFileChange}
        />
        <InputGroup
          label='Nome'
          type='text'
          name='name'
          placeholder={'Digite seu nome'}
          handleChange={handleChange}
          value={user.name}
        />
        <InputGroup
          label='E-mail'
          type='email'
          name='email'
          placeholder={'Digite seu e-maill'}
          handleChange={handleChange}
          value={user.email}
        />
        <InputGroup
          label='Telefone'
          type='tel'
          name='phone'
          placeholder={'Digite seu telefone'}
          handleChange={handleChange}
          value={user.phone}
        />
        <InputGroup
          label='Senha'
          type='password'
          placeholder={'Digite sua senha'}
          name='password'
          handleChange={handleChange}
        />
        <InputGroup
          label='Conirme a senha'
          type='password'
          placeholder={'Confirme a senha'}
          name='confirmpassword'
          handleChange={handleChange}
        />
        <button className='btn btn-primary' type='submit'>Salvar</button>
      </form>
    </div>
  )
}

export default Profile
