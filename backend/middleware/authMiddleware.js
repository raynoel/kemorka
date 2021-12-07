// Lorsque l'usagé se logge avec email/password, un Token est retouné et inscrit dans les headers sous la cké "authorization"
// Ici, le middleware valide le token afin de donner l'accès à des zones protégès
// Notre token contient un obj {id, pw, date d'expiration}
// Le token est généré par /util/generateToken.js
// Le middleware est utilisé dans userRoutes.js
import jwt from 'jsonwebtoken'
import asyncHandler from "express-async-handler";                     // middleware qui catch les erreurs, on peut alors omettre try-catch
import User from '../models/userModel.js'


// Obtient le token des headers et l'utilise pour obtenir les infos de l'usagé contenu dans la DB
const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization                               // Extrait Le token contenu sous la clé 'authorization'
  if (token && token.startsWith('Bearer')) {                          // Vérifie qu'on a utilisé 'Bearer'
    try {
      token = token.split(' ')[1]                                     // Extrait le token du 'Bearer asdlljf87lnf88fk..'
      const decoded = jwt.verify(token, process.env.JWT_SECRET)       // Extrait {id, pw et exp} du token et verifie le pw avec celui .env
      req.user = await User.findById(decoded.id).select('-password')  // Obtient les infos de l'usagé de la DB
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  } else if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})


// Vérifie si c'est un admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}


export { protect, admin }