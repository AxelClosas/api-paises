// import { procesoGuardarPaisesDesdeAPIOriginalEnMongoDB } from '../services/paisesServices.mjs'
import { obtenerListadoDePaises, procesoGuardarPaisesDesdeAPIOriginalEnMongoDB, procesoEliminarPaisesAgregadosEnMongoDB, obtenerSumatoriaAtributo, promedioGini, obtenerMayorGini } from '../services/paisesServices.mjs'

export async function procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController(req, res, next) {
  console.log('📥 HTTP GET /api/cargarPaises - Proceso guardar países desde API Original en MongoDB')
  try {
    await procesoGuardarPaisesDesdeAPIOriginalEnMongoDB()
    console.log('Redirigiendo a /api/paises')
    setTimeout(async () => await res.redirect('/api/paises'), 1000)
  } catch (error) {
    return res.status(500).json(error.response)
  }
}

export async function procesoEliminarPaisesAgregadosEnMongoDBController(req, res, next) {
  console.log('📥 HTTP GET /api/cargarPaises - Proceso guardar países desde API Original en MongoDB')
  try {
    await procesoEliminarPaisesAgregadosEnMongoDB()
    console.log('Redirigiendo a /api/paises')
    setTimeout(async () => await res.redirect('/api/paises'), 1000)
    
  } catch (err) {
    next(err)
  }
}

/* 
  Estructura base de retorno de contenido en las respuestas

  { // La clave que acompaña el contenido será la misma varible o caso contrario se llamará data que será igual a un array vacío
    data: Array de Datos o Vacío,
    error: {
      existe: true o false,
      mensaje: "Mensaje del error",
    }
  }
*/

export async function obtenerListadoDePaisesController(req, res, next) {
  console.log('📥 HTTP GET /api/paises - Listado de países')
  const title = 'Listado de países'
  try {
    const paises = await obtenerListadoDePaises()

    if (paises.length) {
      const totalPoblacion = obtenerSumatoriaAtributo(paises, 'poblacion')
      const totalArea = obtenerSumatoriaAtributo(paises, 'area')
      const promedioGiniPaises = promedioGini(paises)

      if (req.accepts('text/html')) {
        res.render('dashboard', { title, paises, totalPoblacion, totalArea, promedioGiniPaises, obtenerMayorGini, error: { existe: false, mensaje: '' }})
      }
    } else {
      if (req.accepts('text/html')) {
        res.render('dashboard', { title, error: { existe: true, mensaje: 'Ups... Aún no se cargaron los países.' }})
      }
    }

  } catch (error) {
    next(error)
  }
}