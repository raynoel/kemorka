import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import connectDatabase from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config();                                              // Active dotenv

connectDatabase()                                             // fct qui nous connecte à la DB mongoose
const app = express();                                        // initialise express

// Middleware
app.use(express.json())                                       // accepte JSON dans le body

//--------------
// Routes
app.use('/api/products', productRoutes)                       // Redirige 'api/products/' et 'api/products/:id' à "/routes/productRoutes.js"
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID)) // route qui retroune notre ID PayPal

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))  // lors d'une requête d'images ... '/uploads' est le répertoire d://react/mern-tra/uploads

// si 'production' -> on utilise '/frontend/build' pour construire le frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))    // lors d'une requête de '/' on utilise les répertoire 
  app.get('*'), (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')) // Toutes les requêtes au backend (non définies) sont envoyés à /frontend/build/index.html
}

app.use(notFound)                                           // middleware gestion des 404 
app.use(errorHandler)                                       // middleware gestion des erreurs générées par MongoDB et contenant du HTML



const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:5000/`))