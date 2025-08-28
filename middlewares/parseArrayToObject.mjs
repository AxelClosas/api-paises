export const parseArrayToObject = (req, res, next) => {
  if (req.body) { // Verifica si se recibe un body en la petición
    const gini = {} // Creo un objeto auxiliar gini
      Object.keys(req.body).forEach(key => { // Por cada llave del body se realizará una determinada acción
        if (Array.isArray(req.body[key])) { // Si el valor de la llave key obtenido a través de req.body[key] es un array, se hace algo
          if (key === 'mapas' || key === 'banderas') { // Si la llave se llama 'mapas' o 'banderas', tomamos el objeto de su interior y lo reasignamos a la misma llave
            req.body[key] = req.body[key][0] // mapas y banderas llega como un array que contiene un único objeto, por lo tanto, tomamos ese objeto y lo asignamos directamente a la llave, es decir, eliminamos el array como tal
          } else if (key === 'gini') { // En caso de que la llave sea gini
            req.body[key].forEach(item => { // Recorremos cada objeto que llega de la forma por ej: { anio: '2025', valor: '45.5' }
              gini[item['anio']] = Number(item['valor']) // y al objeto auxiliar, le creamos un par llave-valor cuya llave será el valor de anio, y el valor del nuevo par será el mismo valor que trae el objeto antes mencionado
            })
          }
        }
      })
    req.body['gini'] = gini // Reemplazamos la llabe req.body['gini'] por el objeto auxiliar que creamos anteriormente
  }

  next()
}