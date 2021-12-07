import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from "react-paypal-button-v2";                                 // Offre des boutons PayPal et CC
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message.jsx'
import Loader from '../components/Loader.jsx'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'



const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id  
                               
  const [sdkReady, setSdkReady] = useState(false)                                     // Variable pour vérifier si SDK Script PayPal à été ajouté au HTML 
  
  const dispatch = useDispatch()
  const { userInfo }                                 = useSelector((state) => state.userLogin)
  const { order, loading, error }                    = useSelector((state) => state.orderDetails)
  const { loading: loadingPay, success: successPay } = useSelector((state) => state.orderPay) // Vérifie si la commande est payée
  const { loading: loadingDeliver, success: successDeliver } = useSelector((state) => state.orderDeliver)

  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2)               // Arrondi un nb à 2 dédimales (ex. "33.00")
  
  // Attend d'avoir reçu la commande de la DB pour calculer le coût des items
  if (!loading) {     
    order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)) 
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    // fct pour ajouter le Script SDK PayPal '<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>' à la fin de la page
    const addPayPalScript = async () => {                      
      const { data: clientId } = await axios.get('/api/config/paypal')          // Obtient PAYPAL_CLIENT_ID 
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => { setSdkReady(true) }                               // Set 'sdkReady' = true
      document.body.appendChild(script)                         
    }

    if (!order || successPay || successDeliver) {                               // Si vient juste d'être payée ou livrée
      dispatch({ type: ORDER_PAY_RESET })                                       // Efface les infos de 'orderPay: {}' du store
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))                                        // Rafraichi les données
    } else if (!order.isPaid) {                                                 // Si pas payé
      if (!window.paypal) {                                                     // Si le script SDK PayPal absent
        addPayPalScript()                                                       // Ajouter le script SDK PayPal
      } else {
        setSdkReady(true)                                                       // Set 'sdkReady' = true
      }
    }

  }, [ dispatch, orderId, successPay, successDeliver, order, history, userInfo ])

  

  // Gère la réponse de réception de payment de PayPal
  const successPaymentHandler = (paymentResult) => {
    // console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))                                  // Marque la commande payée
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }


  return loading ? ( <Loader /> ) : error ? ( <Message variant='danger'>{error}</Message> ) : (
    <>
      <h1 style={{textAlign: "center"}}>Order Status</h1>
      <Row>
        {/* Info de la commande: Nom, email, adresse, méthode de payment, Items commandés */}
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Order:  {order._id}</h2>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name: </strong> {order.user.name}</p>
              <p><strong>Email: </strong>{' '}<a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p><strong>Address:</strong>{' '}{order.shippingAddress.address}, {order.shippingAddress.city}{' '}{order.shippingAddress.postalCode},{' '}{order.shippingAddress.country}</p>
              {order.isDelivered ? ( <Message variant='success'> Delivered on {order.deliveredAt} </Message> ) : ( <Message variant='danger'>Not Delivered</Message> )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p><strong>Method: </strong>{order.paymentMethod}</p>
              {order.isPaid ? ( <Message variant='success'>Paid on {order.paidAt}</Message> ) : ( <Message variant='danger'>Not Paid</Message> )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? ( <Message>Order is empty</Message> ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                        <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                        <Col md={4}>{item.qty} x ${item.price} = ${addDecimals(item.qty * item.price)}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Carte avec le sommaire des coûts: items, shipping, taxes, total */}
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Order Summary</h2></ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${addDecimals(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* si non-payé, affiche un spinner et les boutons PayPal */}
              {!order.isPaid && (
                <ListGroup.Item> 
                  {loadingPay && <Loader />} 
                  {!sdkReady ? <Loader /> : ( <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} /> )}
                </ListGroup.Item>)
              }

              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type='button' className='btn btn-block' onClick={deliverHandler}>Mark As Delivered</Button>
                </ListGroup.Item>
              )}

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
