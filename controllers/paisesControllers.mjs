// import { procesoGuardarPaisesDesdeAPIOriginalEnMongoDB } from '../services/paisesServices.mjs'
import { obtenerListadoDePaises, procesoGuardarPaisesDesdeAPIOriginalEnMongoDB, procesoEliminarPaisesAgregadosEnMongoDB, obtenerSumatoriaAtributo, promedioGini, obtenerMayorGini } from '../services/paisesServices.mjs'

export async function procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController(req, res) {
  console.log('📥 HTTP GET /api/cargarPaises - Proceso guardar países desde API Original en MongoDB')
  try {
    await procesoGuardarPaisesDesdeAPIOriginalEnMongoDB()
    console.log('Redirigiendo a /api/paises')
    setTimeout(async () => await res.redirect('/api/paises'), 1500)
  } catch (error) {
    return res.status(error.status).json({
      error: error.status,
      mensaje: error.message
    })
  }
}

export async function procesoEliminarPaisesAgregadosEnMongoDBController(req, res) {
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

export async function obtenerListadoDePaisesController(req, res) {
  console.log('📥 HTTP GET /api/paises - Listado de países')
  const title = 'Listado de países'
  try {
    const paises = await obtenerListadoDePaises()

    if (paises.length) {
      const totalPoblacion = obtenerSumatoriaAtributo(paises, 'poblacion')
      const totalArea = obtenerSumatoriaAtributo(paises, 'area')
      const promedioGiniPaises = promedioGini(paises)

      if (req.accepts('text/html')) {
        res.render('dashboard', { title, paises, totalPoblacion, totalArea, promedioGiniPaises, obtenerMayorGini, error: [{}]})
      } else if (req.accepts('application/json')) {
        res.status(200).json( { ...paises, totalPoblacion, totalArea, promedioGiniPaises })
      } else {
        res.status(406).json( { error: { status: 406, mensaje: "Not Acceptable" }})
      }

    } else {
      if (req.accepts('text/html')) {
        res.render('dashboard', { title, error: { status: 404, mensaje: 'Ups... Aún no se cargaron los países.' }})
      } else if (req.accepts('application/json')) {
        res.status(404).json({ error: { status: 404, mensaje: 'Ups... Aún no se cargaron los países.' } })
      } else {
        res.status(406).json( { error: { status: 406, mensaje: "Not Acceptable" }})
      }
    }

  } catch (error) {
    next(error)
  }
}