// Page affichant deux boutons radio pour sélectionner le mode de paiement (Paypal ou Stripe)
import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer.jsx'
import CheckoutSteps from '../components/CheckoutSteps.jsx'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ history }) => {
  const dispatch = useDispatch()

  const { shippingAddress } = useSelector((state) => state.cart)              // Extrait 'shippingAddress' du store
  if (!shippingAddress.address) { history.push('/shipping') }

  const [paymentMethod, setPaymentMethod] = useState('PayPal')                // PayPal par défault

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))                                // Enregistre "paymentMethod: PayPal" dans le store + localStorage 
    history.push('/placeorder')                                               // Redirige sur /placeorder
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check value='PayPal' onChange={(e) => setPaymentMethod(e.target.value)} type='radio' label='PayPal or Credit Card' id='PayPal' name='paymentMethod' checked></Form.Check>
            <Form.Check value='Stripe' onChange={(e) => setPaymentMethod(e.target.value)} type='radio' label='Stripe' id='Stripe' name='paymentMethod'></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'> Continue </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
