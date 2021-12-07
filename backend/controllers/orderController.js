// Chaque bon de commande payé est enregistré dans la DB.
// Ce controller offre les fonctions pour enregistrer une commande, obtenir une commande par ID, modifier une commande
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'



// @desc    Enregistre une commande dans la DB
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    // Cré une nouvelle rangée dans la DB
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    })
    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})


// @desc    Obtient une commande de la DB selon son ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate( 'user', 'name email' ) // Obtient la commande et y ajoute le champ "user": { "name": "", "email": ""} provenant de la collection "users" de la DB
  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})



// @desc    Marque une commande comme étant payée
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {                                         // Réponse de PayPal, transmis via le $_POST 
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }
    const updatedOrder = await order.save()                         // Sauvegarde la commande modifiée
    res.json(updatedOrder)                                          // Retourne la réponse de la DB
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})



// @desc    Retourne les commandes de l'usagé
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})



// @desc    Retourne toutes les commandes
// @route   GET /api/orders
// @access  Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "id name")     // ajoute les champ "user": { "id": "", "name": ""}
  res.json(orders)
})




// @desc    Marque une commande comme étant livrée
// @route   PUT /api/orders/:id/deliver
// @access  Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    const updatedOrder = await order.save()                         // Sauvegarde la commande modifiée
    res.json(updatedOrder)                                          // Retourne la réponse de la DB
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})



export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered }
