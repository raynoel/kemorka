// Les Controllers sont appelés par les productRoutes.js et implémentent les fonctionnalitées
import asyncHandler from 'express-async-handler';                     // Gère les erreurs async sans bloc try-catch
import Product from '../models/productModel.js'

// @desc      Obtient tous les produits 
// @route     GET /api/products
// @access    public
const getProducts = asyncHandler(async (req, res) => {                // asyncHandler est un middleware qui catch les erreurs, on peut donc omettre try-catch
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1                      // obtient la valeur après ?pageNumber=
  const searchParams = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {}                                 
  const count    = await Product.countDocuments({ ...searchParams })
  const products = await Product.find({ ...searchParams }).limit(pageSize).skip((page - 1) * pageSize)
  const pages = Math.ceil(count / pageSize)
  res.json({products, page, pages })
})


// @desc      Obtient un produit 
// @route     GET /api/products/:id
// @access    public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)               // Utilise la méthode findById() de l'obj Product construit par mongoose
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not nound')
  }
})


// @desc      Supprime un produit 
// @route     DELETE /api/products/:id
// @access    Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  // if (req.user._id === product.user._id){                          // Si on voudrait Limiter la suppression à l'admin qui a ajouté le produit
  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})



// @desc    Cré un produit (On cré un produit avec un template qui sera modifié tout de suite via 'updateProduct')
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})



// @desc    Modifie un produit
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})



// @desc    Ajoute un avis
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)                     
  if (product) {
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString()) // si l'usagé à déjà émis un avis sur le produit
    if (alreadyReviewed) {
      res.status(400)
      throw new Error('You already reviewed this product')
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }
    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})




// @desc    Retourne les produits les mieux notés
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ rating: -1}).limit(3)
  res.json(products)
})



export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }