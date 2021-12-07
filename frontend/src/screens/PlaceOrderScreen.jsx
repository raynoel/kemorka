// Affiche un sommaire des infos pour la commande: adresse de livraison, méthode de paiement, liste des items... et bouton PLACE ORDER
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message.jsx'
import CheckoutSteps from '../components/CheckoutSteps.jsx'
import { createOrder } from '../actions/orderActions'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)                               // Obtient cart du store
  const { order, success, error } = useSelector((state) => state.orderCreate)   // Obtient orderCreate du store

  if (!cart.shippingAddress.address) {
    history.push('/shipping')
  } else if (!cart.paymentMethod) {
    history.push('/payment')
  }

  // Arrondi un nombre à 2 décimales (ex. "33.00")
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2)
  // Coût des items, shipping, taxes et le total
  cart.itemsPrice     = Number(addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)))
  cart.shippingPrice  = Number(addDecimals(cart.itemsPrice > 100 ? 10 : 40))
  cart.taxPrice       = Number(addDecimals(0.15 * cart.itemsPrice))
  cart.totalPrice     = Number(addDecimals(cart.itemsPrice + cart.shippingPrice + cart.taxPrice))

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
    }
    // eslint-disable-next-line
  }, [history, success])

  const placeOrderHandler = () => {
    dispatch( createOrder({
        orderItems:       cart.cartItems,
        shippingAddress:  cart.shippingAddress,
        paymentMethod:    cart.paymentMethod,
        itemsPrice:       cart.itemsPrice,
        shippingPrice:    cart.shippingPrice,
        taxPrice:         cart.taxPrice,
        totalPrice:       cart.totalPrice,
      })
    )
  }

  return (
    <>
      <h1 style={{textAlign: "center"}}>Place Order Screen</h1>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>

        <Col md={8}>
          <ListGroup variant='flush'>
            {/* Adresse de livraison */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            {/* Méthode de paiement */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            {/* Liste des items dans le panier: photo, description, qty, prix */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? ( <Message>Your cart is empty</Message> ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                        <Col><Link to={`/product/${item.product}`}>  {item.name} </Link></Col>
                        <Col md={4}>{`${item.qty} x $${item.price} = ${addDecimals(item.qty * item.price)}`}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        
        {/* Carte avec le sommaire: coût des items, coût du shipping, taxes, total et bouton PLACE ORDER */}
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item> <h2>Order Summary</h2> </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item> 
                {error && <Message variant='danger'>{error}</Message>} 
              </ListGroup.Item>
              <ListGroup.Item>
                <Button type='button' className='btn-block' disabled={cart.cartItems === 0} onClick={placeOrderHandler}> Place Order </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
