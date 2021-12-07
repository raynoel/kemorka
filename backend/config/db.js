import mongoose from 'mongoose'
import colors from 'colors'                                   // permet d'ajouter des couleurs au textes de la console

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { 
      // set-up options qu'on doit ajouter à la version courante de mongoose
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Erreur de connection à MongoDB: ${error.message}`.red.underline.bold);
    process.exit(1);                                          // termine la commande (1 = error)
  }
}

export default connectDB