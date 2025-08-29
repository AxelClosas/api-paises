// import { procesoGuardarPaisesDesdeAPIOriginalEnMongoDB } from '../services/paisesServices.mjs'
import Pais from '../models/Pais.mjs'
import PaisMolde from '../models/PaisMolde.mjs'
import PaisRepository from '../repositories/PaisRepository.mjs'
import { obtenerListadoDePaises, procesoGuardarPaisesDesdeAPIOriginalEnMongoDB, procesoEliminarPaisesAgregadosEnMongoDB, obtenerSumatoriaAtributo, promedioGini, obtenerMayorGini, cantidadDocumentos } from '../services/paisesServices.mjs'

export async function procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController(req, res) {
  console.log('⬆️ HTTP POST /api/cargarPaises - Proceso guardar países desde API Original en MongoDB')
  try {
    await procesoGuardarPaisesDesdeAPIOriginalEnMongoDB()

    if (req.accepts('text/html')) {
      console.log('Redirigiendo a /api/paises')
      setTimeout(async () => await res.redirect('/api/paises'), 1500)
    } else if (req.accepts('application/json')) {
      return await res.status(201).json({
        estado: 201,
        mensaje: 'Los países fueron agregados con éxito a la Base de Datos.'
      })
    } else {
      return await res.status(406).json({ error: { status: 406, message: 'Not Acceptable'}})
    }
  } catch (error) {
    return res.status(error.status).json({
      error: error.status,
      mensaje: error.message
    })
  }
}

export async function procesoEliminarPaisesAgregadosEnMongoDBController(req, res) {
  console.log('❌ HTTP DELETE /api/cargarPaises - Proceso eliminar países desde API Original en MongoDB')
  try {
    await procesoEliminarPaisesAgregadosEnMongoDB()
    if (req.accepts('text/html')) {
      console.log('Redirigiendo a /api/paises')
      setTimeout(async () => await res.redirect('/api/paises'), 1500)
    } else if (req.accepts('application/json')) {
      return res.status(204).json({
        status: 204,
        message: 'Los países fueron eliminados con éxito de la Base de Datos.'
      })
    } else {
      return await res.status(406).json({ error: { status: 406, message: 'Not Acceptable'}})
    }
  } catch (error) {
    return res.status(500).json({
      error: error,
      mensaje: error.msg
    }) 
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
        res.status(200).json( [...paises, { totalPoblacion, totalArea, promedioGiniPaises }] )
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
    return res.status(500).json({
      estado: 500,
      mensaje: error.msg
    })
  }
}

export async function vistaPanelDeControlController(req, res) {

  const title = 'Panel de Control de API Países'
  try {
    const cantPaises = await cantidadDocumentos()
    if (cantPaises) {
      if (req.accepts('text/html')) {
        return await res.render('panelDeControl', { title, cantPaises, error: { status: 200, mensaje: 'Para ver los países entra en el Listado de Países'}})
      } else if (req.accepts('application/json')) {
        return await res.status(200).json({ title, cantPaises, error: { status: 200, mensaje: 'Para ver los países realiza una petición GET en /api/paises'}})
      } else {
        res.status(406).json( { error: { status: 406, mensaje: "Not Acceptable" }})
      }
    } else {
      if (req.accepts('text/html')) {
        return await res.render('panelDeControl', { title, cantPaises, error: { status: 404, mensaje: 'Ups... Aún no se cargaron los países.' }})
      } else if (req.accepts('application/json')) {
        return await res.status(404).json({ title, cantPaises, error: { status: 404, mensaje: 'Para cargar los países realiza una petición POST a /api/paises/cargarPaises'}})
      } else {
        res.status(406).json( { error: { status: 406, mensaje: "Not Acceptable" }})
      }
    }
  } catch (error) {
    return res.status(500).json({
      estado: 500,
      mensaje: error.message
    })
  }
}

export async function vistalFormAgregarPaisController(req, res) {
  const title = 'Agregar Nuevo País'
  return await res.render('formAgregarPais', { title })
}

export async function agregarNuevoPaisController(req, res) {
  try {
    const paisEnBD = await PaisRepository.buscarPorQuery({nombreOficial: req.body.nombreOficial})
    if (paisEnBD.length !== 0)
      throw {
        status: 409,
        message: 'Conflicto. El país ingresado ya existe en la Base de Datos.'
      }

    const nuevoPais = new PaisMolde(req.body)
    const resultado = await PaisRepository.agregar(nuevoPais)

    if (req.accepts('text/html')) {
      return await res.redirect('/api/paises')
    } else if (req.accepts('application/json')) {
      return await res.status(200).json(resultado)
    } else {
      res.status(406).json( { error: { status: 406, mensaje: "Not Acceptable" }})
    }

  } catch (error) {
    return res.status(500).json({
      estado: error.status,
      mensaje: error.message
    })
  }
}