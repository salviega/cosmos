import React from 'react';
import defaultImage from '../../asserts/images/default-image.jpg'
import './CosmosMaker.scss'
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function CosmosMaker({createItem, setSincronizedItems }) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [imageBase64, setImageBase64] = React.useState('')
  const site = React.useRef()
  const city = React.useRef()
  const price = React.useRef()
  const artist = React.useRef()
  const address = React.useRef()
  const capacity = React.useRef()
  const doorOpening = React.useRef()
  const responsible = React.useRef()
  const minimunEntryAge = React.useRef()

  const createEvent = async (event) => {
    event.preventDefault();
    const info = {
      owner: auth.user.walletAddress, 
      imageBase64: imageBase64,
      artist: artist.current.value, 
      site: site.current.value,
      city: city.current.value,      
      minimunEntryAge: minimunEntryAge.current.value,
      responsible: responsible.current.value,
      address: address.current.value,
      doorOpening: doorOpening.current.value,
      capacity: capacity.current.value,
      price: price.current.value
    }
    await createItem(info)
    setSincronizedItems(false)
    alert('Event created')
    navigate('/')
  }

  const handleImage = (event) => {
    const files = event.target.files
    const file = files[0]
    getBase64(file)
  }

  const getBase64 = (file) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImageBase64(reader.result)
    }
  }
  
  if(auth.user.walletAddress === "Connect your wallet") {
    return <Navigate to='/'/>
  }
  return (
    <div className="maker">
    <h1 className="maker__title">Sé parte de nuestro Cosmos</h1>
    <form className="maker-form" onSubmit={createEvent}>
      <p className="maker-form__description">Comparte tus fatos si te interesa ser un comercio aliado de BBVA y nuestro equipo se encargará de crear un NFT personalizado.</p>
    
      <span>
        <p className="maker-form__subtitle">ID</p>
        <input className="maker-form__add" ref={site}/>
      </span>
      <span>
        <p className="maker-form__subtitle">Número máximo de NFTs</p>
        <input className="maker-form__add" ref={city}/>
      </span>
      <span>
        <p className="maker-form__subtitle">Wallet del manager del proyecto</p>
        <input className="maker-form__add" ref={minimunEntryAge}/>
      </span>
      <span>
        <p className="maker-form__subtitle">URL</p>
        <input className="maker-form__add" ref={responsible}/>
      </span>
      <span>
        <p className="maker-form__subtitle">Precio</p>
        <input className="maker-form__add" ref={address} />
      </span>
      <span>
        <p className="maker-form__subtitle">Wallet del contrato</p>
        <input className="maker-form__add" ref={doorOpening}/>
      </span>
      <span>
        <p className="maker-form__subtitle">Nombre del beneficio</p>
        <input className="maker-form__add" ref={capacity}/>
      </span>
      <span>
        <p className="maker-form__subtitle">Iniciales del beneficio (ej. Dos por uno = DXU)</p>
        <input className="maker-form__add" ref={price}/>
      </span>
      <button className="maker-form__submit">Enviar</button>
    </form>
</ div>
  )
}