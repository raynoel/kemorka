// Génère un token contenant le id du client, le pw secret et la date d'expiration du Token
import jwt from 'jsonwebtoken'


// Génère un code contenant le id du client, le mot de passe secret et la date d'expiration du Token... ici 30 jours
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

export default generateToken