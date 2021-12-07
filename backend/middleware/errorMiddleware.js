// Importé par server.js


// gestion des 404
const notFound = (req, res, next) => {
  const error = new Error(`404 Page Introuvable - ${req.originalUrl}`)
  res.status(404)
  next(error)                                                               // passe à errorHandler() et transmet l'erreur
}

// gestion des erreurs contenant du HTML émises par MongoDB. Elles sont identifiable par "statusCode=200"
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode          // si statusCode=200
  res.status(statusCode)                                                    // Set res.status(500)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack         // Affiche le stack si NODE_ENV === 'production'
  })
}



export { notFound, errorHandler }