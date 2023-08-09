import React, { useState } from 'react'
import InputGroup from '../../../components/InputGroup'
import api from '../../../utils/api'

function AddPet() {
    const [pet, setPet] = useState({})
    const [preview, setPreview] = useState()
    const [token] = useState(localStorage.getItem('token') || '')

    function handleChange(e){
        setPet({...pet, [e.target.name]: e.target.value})
    }

    const [images, setImage] = useState(null)

    function onFileChange(e){
        setPreview(URL.createObjectURL(e.target.files[0]))
        setImage(e.target.files[0])
    }

    async function handleSubmit(e){
        e.preventDefault()

        const formData = new FormData()

        if(images){
            formData.append('images', images)
        }

        await Object.keys(pet).forEach((key) => formData.append(key, pet[key]))

        const data = await api.post(`pets/create`, formData, {
            headers:{ //requisição mandada em http
                Authorization: `Bearer ${JSON.parse(token)}`,
                //linha que especifica que o formulário aceite conteúdos multimídia
                'Content-Type': "multipart/form-data"
            }
        }).then((response) => {
            return response.data
        }).catch((err) => {
            alert(err.response.data)
            return err.response.data
       })
       alert(data.message)
    }

    return (
        <div>
            <h1>Cadastre um Pet para adoção</h1>
            <form onSubmit={handleSubmit}>
                <InputGroup
                    type='file'
                    label='Colocar foto do pet'
                    name='image'
                    handleChange={onFileChange}
                />
                <InputGroup
                    type='text'
                    label='Digite o nome do pet'
                    name='name'
                    placeholder='Digite aqui o nome do pet'
                    handleChange={handleChange}
                />
                <InputGroup
                    type='number'
                    label='Digite a idade do pet'
                    name='age'
                    placeholder='Digite aqui a idade do pet'
                    handleChange={handleChange}
                />
                <InputGroup
                    type='number'
                    label='Digite o peso do pet'
                    name='weight'
                    placeholder='Digite aqui o peso do pet'
                    handleChange={handleChange}
                />
                <InputGroup
                    type='text'
                    label='Digite a cor do pet'
                    name='color'
                    placeholder='Digite aqui a cor do pet'
                    handleChange={handleChange}
                />
                <button className='btn btn-primary' type='submit'>Salvar</button>
            </form>
        </div>
    )
}

export default AddPet
