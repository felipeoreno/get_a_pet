import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../utils/api'

function MyPets() {
  const [pets, setPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    api.get('/pets/mypets', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setPets(response.data.pets)
    })
  }, [token])

  async function removePet(id) {
    const data = await api.delete(`/pets/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      const updatedPets = pets.filter((pet) => pet.id !== id) //filtrando o pet para não apagar o errado
      setPets(updatedPets)
      return response.data
    }).catch((err) => {
      return err.response.data
    })
    alert(data.message)
  }

  async function concludeAdoption(id){
    const data = await api.patch(`/pets/conclude/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      return response.data
    }).catch((err) => {
      return err.response.data
    })
    alert(data.message)
  }

  return (
    <section className='container'>
      <div>
        <h3>Meus pets cadastrados</h3>
        <Link to='/pet/add'>Cadastrar Pet</Link>
      </div>
      <div className='d-flex justify-content-around flex-wrap'>
        {pets.lenth > 0 &&
          pets.map((pet) => {
            <figure
              key={pet.id}
              className='card'
              style={{ width: '18rem' }}
            >
              <img
                src={``}
                alt={pet.name}
                className='card-img-top'
                style={{ height: '300px' }}
              />
              <figcaption className='card-body'>
                <h5 className='card-title'>{pet.name}</h5>
                <div>
                  {pet.available ? (
                    <>
                      {pet.adopter && (
                        <button
                          onClick={() => { concludeAdoption(pet.id) }}
                        >Concluir adoção</button>
                      )}
                      <Link className='btn btn-warning'>Editar</Link>
                      <button
                        onClick={() => { removePet(pet.id) }}
                      >Excluir</button>
                    </>
                  ) : (
                    <p>Pet já adotado</p>
                  )}
                </div>
              </figcaption>
            </figure>
          })
        }
        {pets.length === 0 && <p>Ainda não há pets adotados</p>}
      </div>
    </section>
  )
}

export default MyPets