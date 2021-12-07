// Script qu'on peut exécuter et qui permet d'importer des records contenus dans des fichiers sur MongoDB
// >>> node backend/seeder.js                           // Seeder 
// >>> node backend/seeder.js -d                        // Supprime les données de la DB
import mongoose from 'mongoose'                         // outil de validation de données et relation entre les différentes tables e 
import dotenv from 'dotenv'                             // contient l'adresse de la DB sur MongoDB
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'                // Les modèles permettent de supprimer la DB sur
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config();
connectDB()                                             // Connecte à MongoDB

// fct pour seeder la DB
const importData = async () => {
  try {
    // Supprime les tables sur MongoDB avec mongoose
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    // Seed MongoDB avec les usagés et met ceux-ci dans une liste temporaire
    const createdUsers = await User.insertMany(users)
    
    // Extrait le _id du premier usagé (admin) ajouté à MongoDB. (ps. pcq le premier record de '/data/users.js' est l'admin)
    const adminID = createdUsers[0]._id 

    // Cré une liste temporaire des produits de "/data/products.js" et leur ajoute le champ "user: adminID"
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminID }
    })

    // Seed MongoDB avec les produits
    await Product.insertMany(sampleProducts)

    console.log('Data Imported!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}


// fct pour vider la DB 
const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    console.log('Data Destroyed!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}


// Si l'appel est "node backend/seeder.js -d": Supprime les données de la DB
if (process.argv[2] === '-d') {                                   // process.argv[2] extrait param '-d' de l'appel
  destroyData()
} else {
  importData()
}
