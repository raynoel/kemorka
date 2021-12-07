import express from 'express'
const router = express.Router()
import { authUser, registerNewUser, getUserProfile, updateUserProfile, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

// Routes
router.route('/')
.get(protect, admin, getUsers)
.post(registerNewUser)
router.post('/login', authUser)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

  
export default router