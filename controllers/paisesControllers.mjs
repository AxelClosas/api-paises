// import { procesoGuardarPaisesDesdeAPIOriginalEnMongoDB } from '../services/paisesServices.mjs'
import { isValidObjectId } from 'mongoose'
import PaisMolde from '../models/PaisMolde.mjs'
import PaisRepository from '../repositories/PaisRepository.mjs'
import { validationResult } from 'express-validator'
import { obtenerListadoDePaises, procesoGuardarPaisesDesdeAPIOriginalEnMongoDB, procesoEliminarPaisesAgregadosEnMongoDB, obtenerSumatoriaAtributo, obtenerPaisPorId, actualizarPaisPorId, promedioGini, obtenerMayorGini, obtenerAnioMayorGini, cantidadDocumentos, eliminarPais } from '../services/paisesServices.mjs'

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
  return await res.render('formAgregarPais', { title, obtenerAnioMayorGini, obtenerMayorGini, errores: [], pais: {}, old: {} })
}

export async function agregarNuevoPaisController(req, res) {
  try {    
    const paisEnBD = await PaisRepository.buscarPorQuery({nombreOficial: req.body.nombreOficial})
    if (paisEnBD.length !== 0) {
      if (req.accepts('text/html')) {
        // Renderizar directamente la vista con el error
        return res.status(409).render('formAgregarPais', {
          title: 'Agregar País',
          obtenerAnioMayorGini,
          obtenerMayorGini,
          errores: [{ msg: 'Conflicto. El nombre del país ingresado ya existe en la Base de Datos.' }],
          pais: {},
          old: req.body
        })
      } else {
        // Para JSON, mantener el comportamiento original
        throw {
          status: 409,
          message: 'Conflicto. El nombre del país ingresado ya existe en la Base de Datos.'
        }
      }
    }

    const nuevoPais = new PaisMolde(req.body)
    const resultado = await PaisRepository.agregar(nuevoPais)

    if (req.accepts('text/html')) {
      return await res.redirect('/api/paises')
    } else if (req.accepts('application/json')) {
      return await res.status(200).json({
        estado: 201,
        nuevoPais: resultado
      })
    } else {
      res.status(406).json( { error: { status: 406, mensaje: "Not Acceptable" }})
    }

  } catch (error) {
    if (req.accepts('application/json')) {
      return res.status(500).json({
        estado: error.status,
        mensaje: error.message
      })
    }
    // Pasar errores y datos antiguos a la vista
    return res.status(500).render('formAgregarPais', {
      title: 'Agregar País',
      obtenerAnioMayorGini,
      obtenerMayorGini,
      errores: [{ msg: error.message }],
      pais: {},
      old: req.body
    })
  }
}

export async function vistaFormEliminarPaisPorIdController(req, res) {
  const title = 'Confirmar eliminación'
  try {
    if (isValidObjectId(req.params.id)) {
      const pais = await obtenerPaisPorId(req.params.id)
      if (pais !== null) {
        return await res.render('formEliminarPais', { title, pais })
      }
    } else {
      throw {
        status: 422,
        message: 'El ID ingresado no corresponde a un ObjectId de Mongoose'
      }
    }
  } catch (error) {
    return await res.status(500).json({
      estado: error.status,
      message: error.message
    })
  }
}

export async function eliminarPaisPorIdController(req, res) {
  console.log('❌ HTTP DELETE /api/paises/eliminarPais/:id - Eliminar País por ID')
  try {
    if (isValidObjectId(req.params.id)) {
      const pais = await obtenerPaisPorId(req.params.id)
      if (pais !== null) {
        await eliminarPais(pais._id)

        if (req.accepts('text/html')) {
          return res.redirect('/api/paises')          
        } else if (req.accepts('application/json')) {
          return res.status(204).json({
            estado: 204,
            mensaje: `Se eliminó correctamente el país ${pais.nombreOficial}`
          })
        } else {
          res.status(406).json( { error: { status: 406, mensaje: "Not Acceptable" }})
        }
      } else {
        throw {
          status: 404,
          message: 'No se encontró el País. Revisa el ID ingresado.'
        }
      }
    } else {
      throw {
        status: 422,
        message: 'El ID ingresado no corresponde a un ObjectId de Mongoose'
      }
    }
  } catch (error) {
    return res.status(500).json({
      estado: error.status,
      message: error.message
    })
  }
  
}

export async function vistaFormEditarPaisController(req, res) {
  const title = 'Editar País'
  try {
    if (isValidObjectId(req.params.id)) {
      const pais = await obtenerPaisPorId(req.params.id)
      return await res.render('formEditarPais', { title, pais, obtenerMayorGini, obtenerAnioMayorGini, errores: [], old: {} })
    } else {
      throw {
        status: 422,
        message: 'El ID ingresado no corresponde a un ObjectId de Mongoose'
      }
    }
  } catch (error) {
    // Si hay error, mostrarlo en la vista de edición y mantener los datos enviados
    return res.status(500).render('formEditarPais', {
      title: 'Editar País',
      pais: {},
      obtenerMayorGini,
      obtenerAnioMayorGini,
      errores: [{ msg: error.message }],
      old: req.body
    })
  }
}

export async function editarPaisController(req, res) {
  try {
    if (isValidObjectId(req.params.id)) {
      const paisId = req.params.id
      const atributos = req.body
      const paisEditado = await actualizarPaisPorId(paisId, atributos)
      if (paisEditado !== 'null') {
        if (req.accepts('text/html')) {
          return await res.redirect('/api/paises')
        } else if (req.accepts('application/json')) {
          return await res.status(200).json({
            estado: 200,
            mensaje: 'País editado correctamente',
            datos: paisEditado
          })
        } else {
          res.status(406).json( { error: { status: 406, mensaje: "Not Acceptable" }})
        }
      }
    }
  } catch (error) {
    // Si hay error al editar, mostrarlo en la vista de edición y mantener los datos enviados
    return res.status(500).render('formEditarPais', {
      title: 'Editar País',
      pais: {},
      obtenerMayorGini,
      obtenerAnioMayorGini,
      errores: [{ msg: error.message }],
      old: req.body
    })
  }
}