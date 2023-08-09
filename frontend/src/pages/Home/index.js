//index.js do HOME
import React from 'react'
import api from '../../utils/api'

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Home() {

  const [pets, setPets] = useState([])

  useEffect(() => {
    api.get('/pets').then((response) => {
      setPets(response.data.pets)
    })
  }, [])
  return (
    <section>
      <div >
        <h1>Adote um Pet</h1>
        <p>Veja os detalhes de cada um e conheça o tutor deles</p>
      </div>
      <div className='d-flex justify-content-around flex-wrap'>
        {pets.length > 0 ? (
          pets.map((pet) => (
            <figure className='card' style={{ width: '18rem' }} key={pet.id}>
              <img
                src={`http://localhost:5000/images/pets/${pet.ImagePets && pet.ImagePets[0] && pet.ImagePets[0].image}`}
                className='card-img-top'
                style={{height: '300px'}}
              />
              <figcaption className='card-body'>
                <h3 className='card-title'>{pet.name}</h3>
                <p className='card-text'>
                  <span>Peso:</span> {pet.weight}kg
                </p>
                {pet.available ? (
                  <Link className="btn btn-warning" to={`/pet/${pet.id}`}>Mais detalhes</Link>
                ) : (
                  <p className='card-text'>Adotado!</p>
                )}
              </figcaption>
            </figure>
          ))
        ) : (
          <p>Não há pets cadastrados ou disponíveis para adoção no momento!</p>
        )}
      </div>
    </section>
  )
}

export default Home