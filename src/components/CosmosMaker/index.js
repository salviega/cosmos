import React from 'react';
import defaultImage from '../../asserts/images/default-image.jpg'
import './CosmosMaker.scss'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function CosmosMaker({createItem}) {
  const initialState = {
    imageBase64: "",
    site: "",
    city: "",
    minimunEntryAge: "",
    responsible: "",
    address: "",
    doorOpening: "",
    capacity: ""
  }
  const auth = useAuth()
  const [event, setEvent] = React.useState(initialState) 
  const [imageBase64, setImageBase64] = React.useState('')
  const site = React.useRef()
  const city = React.useRef()
  const address = React.useRef()
  const capacity = React.useRef()
  const doorOpening = React.useRef()
  const responsible = React.useRef()
  const minimunEntryAge = React.useRef()

  const createEvent = async (event) => {
    event.preventDefault();
    const info = {
      imageBase64: imageBase64,
      site: site.current.value,
      city: city.current.value,      
      minimunEntryAge: minimunEntryAge.current.value,
      responsible: responsible.current.value,
      address: address.current.value,
      doorOpening: doorOpening.current.value,
      capacity: capacity.current.value,
    }
    console.log(info)
    await createItem(info)
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
    <h1 className="maker__title">Create new event</h1>
    <form className="maker-form" onSubmit={createEvent}>
      <p className="maker-form__description">Click on the pictue to upgrade the image</p>
      <div className='maker-form-image'>
          <figure>
            <img src={imageBase64 === '' ? defaultImage : imageBase64 } alt="default" />
            <figcaption>
              <input className='maker-form-image__upgrade' type='file' accept='image/x-png,image/gif,image/jpeg' onChange={handleImage}/>
            </figcaption>
          </figure>
      </div>  
      <span>
        <p className="maker-form__subtitle">Site</p>
        <input className="maker-form__add" ref={site}/>
      </span>
      <span>
        <p className="maker-form__subtitle">City</p>
        <input className="maker-form__add" ref={city}/>
      </span>
      <span>
        <p className="maker-form__subtitle">Minimun entry age</p>
        <input className="maker-form__add" ref={minimunEntryAge}/>
      </span>
      <span>
        <p className="maker-form__subtitle">Responsible</p>
        <input className="maker-form__add" ref={responsible}/>
      </span>
      <span>
        <p className="maker-form__subtitle">Address</p>
        <input className="maker-form__add" ref={address} />
      </span>
      <span>
        <p className="maker-form__subtitle">Door opeing</p>
        <input className="maker-form__add" ref={doorOpening}/>
      </span>
      <span>
        <p className="maker-form__subtitle">Capacity</p>
        <input className="maker-form__add" ref={capacity}/>
      </span>
      <button className="maker-form__submit">Create</button>
    </form>
</ div>
  )
}