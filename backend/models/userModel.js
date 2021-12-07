import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin:  { type: Boolean, required: true, default: false },
  }, 
  { timestamps: true }
)

// matchPassword() vérifie si le pw match celui encodé dans la DB
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}


// Middleware de mongoose, appliqué lors de l'exécution de User.create() pour encoder et saler le pw
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})


// Définit les champs nécessaires pour ajouter 'une rangée' à la DB-User
const User = mongoose.model('User', userSchema)

export default User
