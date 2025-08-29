export const parseGiniToValidObject = (req, res, next) => {
  const giniFormateado = {}
  if (req.body && req.body['gini'] && Array.isArray(req.body['gini'])) { // Verifica si se recibe un body en la petición y si existe contenido relacionado a la llave gini
    /* En la llave gini del body, debería recibir lo siguiente desde el formulario HTML
      [
        { anio: '2025', valor: '25.1' },
        { anio: '2051', valor: '23.1' }
      ]
    */
    console.log(req.body['gini'])
    req.body['gini'].forEach(item => {
      if(item['anio'] !== '' && item['valor'] !== '')
        giniFormateado[item['anio']] = Number(item['valor'])
    })
    req.body['gini'] = giniFormateado
  } else {
    console.log(req.body['gini'])
  }

  next()
}