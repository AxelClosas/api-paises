function parseString(string) {
  return string.split(',' || ' ').map(element => element.trim()).filter(element => element.length > 0)
}

export const parseStringToArray = (req, res, next) => {
  const campos = ['capital', 'idiomas', 'fronteras']

  campos.forEach(campo => {
    if (typeof req.body[campo] === 'string' ) {
      req.body[campo] = parseString(req.body[campo])
    }
  })

  next()
}
