import sanitizeHtml from 'sanitize-html'

const sanitizeOptions = {
  allowedTags: [], // No permitir ningún HTML tag
  allowedAttributes: {}, // No permitir ningún atributo
  // Puedes personalizar las opciones según tus necesidades
}

function esObjeto(valor) {
  return typeof valor === 'object' && valor !== null
}
// Middleware global para sanitizar todo el body
export const sanitizarPeticionBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], sanitizeOptions)
      } else if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key].map(item => 
          typeof item === 'string' ? sanitizeHtml(item, sanitizeOptions) : item
        ).filter(item => item.length > 0)
      } else {
        if (key === 'banderas') {
          req.body[key]['png'] = sanitizeHtml(req.body[key]['png'], sanitizeOptions)
          req.body[key]['svg'] = sanitizeHtml(req.body[key]['svg'], sanitizeOptions)
          req.body[key]['alt'] = sanitizeHtml(req.body[key]['alt'], sanitizeOptions)
          req.body[key]['alt'] = req.body[key]['alt'].trim()
        }
      }
    })
  }
  next()
}