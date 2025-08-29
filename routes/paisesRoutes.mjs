import { Router } from 'express'
import { obtenerListadoDePaisesController } from '../controllers/paisesControllers.mjs'
import { procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController, procesoEliminarPaisesAgregadosEnMongoDBController } from '../controllers/paisesControllers.mjs'
import { vistaPanelDeControlController, vistalFormAgregarPaisController, vistaFormEliminarPaisPorIdController, vistaFormEditarPaisController } from '../controllers/paisesControllers.mjs'
import { agregarNuevoPaisController, eliminarPaisPorIdController, editarPaisController } from '../controllers/paisesControllers.mjs'
import { sanitizarPeticionBody } from '../middlewares/sanitizadorGlobal.mjs'
import { parseStringToArray } from '../middlewares/parseStringToArray.mjs'
import { parseGiniToValidObject } from '../middlewares/parseGiniToValidObject.mjs'
import { agregarValidationRules } from '../middlewares/validationRules.mjs'
import { handleValidationErros } from '../middlewares/handleValidationErros.mjs'


const router = Router()

router.get('/paises', obtenerListadoDePaisesController)
router.post('/paises/cargarPaises', procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController)
router.post('/paises/nuevoPais', parseStringToArray, parseGiniToValidObject, sanitizarPeticionBody, agregarValidationRules(), handleValidationErros, agregarNuevoPaisController)

router.delete('/paises/eliminarPaises', procesoEliminarPaisesAgregadosEnMongoDBController)
router.delete('/paises/borrarPais/:id', eliminarPaisPorIdController)

router.put('/paises/editarPais/:id', parseStringToArray, parseGiniToValidObject, sanitizarPeticionBody, agregarValidationRules(), handleValidationErros, editarPaisController)

// Panel de Control
router.get('/paises/panelDeControl', vistaPanelDeControlController)

// Formularios
router.get('/paises/formAgregar', vistalFormAgregarPaisController)
router.get('/paises/formEliminar/:id', vistaFormEliminarPaisPorIdController)
router.get('/paises/formEditar/:id', vistaFormEditarPaisController)

export default router