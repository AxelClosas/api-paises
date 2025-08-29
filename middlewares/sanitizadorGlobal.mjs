import sanitizeHtml from 'sanitize-html'

const sanitizeOptions = {
  allowedTags: [], // No permitir ningún HTML tag
  allowedAttributes: {}, // No permitir ningún atributo
  // Puedes personalizar las opciones según tus necesidades
}

// Middleware global para sanitizar todo el body
export const sanitizarPeticionBody = (req, res, next) => {
  if (req.body) { // Verifica si existe el cuerpo de la petición
    Object.keys(req.body).forEach(key => { // Por cada llave del cuerpo de la petición verifica su tipo y aplica la sanitización correspondiente
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], sanitizeOptions)
      } else if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key].map(item => 
          typeof item === 'string' ? sanitizeHtml(item, sanitizeOptions) : item
        ).filter(item => item.length > 0) // En este caso, además de aplicar un map sobre el array, se aplica un filter dado que si viene un elemento html separado por coma, al final de la sanitización quedaba un elemento vacío y rompía la estructura
      } else { // En caso de no ser un string y tampoco un array, la última opción es que se trata de un Objeto JS, por lo que consulto si la llave se llama banderas para sanitizar cada string que viene en sus propiedades
        if (key === 'banderas') {
          req.body[key]['png'] = sanitizeHtml(req.body[key]['png'], sanitizeOptions)
          req.body[key]['svg'] = sanitizeHtml(req.body[key]['svg'], sanitizeOptions)
          req.body[key]['alt'] = sanitizeHtml(req.body[key]['alt'], sanitizeOptions)
          req.body[key]['alt'] = req.body[key]['alt'].trim()
        }
      }
    })
  }
  next() // Continua al siguiente Middleware
}