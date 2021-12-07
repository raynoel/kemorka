import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer.jsx'
import CheckoutSteps from '../components/CheckoutSteps.jsx'
import { saveShippingAddress } from '../actions/cartActions'

const ShippingScreen = ({ history }) => {
  const { shippingAddress } = useSelector(state => state.cart)                        // Extrait 'shippingAddress' du store
  
  const [address, setAddress] = useState(shippingAddress.address)                     
  const [city, setCity] = useState(shippingAddress.city)                              
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)            
  const [country, setCountry] = useState(shippingAddress.country)                     

  const dispatch = useDispatch()

  // Enregistre shippingAddress : { address, city, postalCode, country } dans le store + localStorage 
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    history.push('/payment')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} type='text' placeholder='Enter address' required></Form.Control>
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control value={city} onChange={(e) => setCity(e.target.value)} type='text' placeholder='Enter city' required></Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control value={postalCode} onChange={(e) => setPostalCode(e.target.value)} type='text' placeholder='Enter postal code' required></Form.Control>
        </Form.Group>

        <Form.Group controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} type='text' placeholder='Enter country' required></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'> Continue </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
