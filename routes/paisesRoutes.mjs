import { Router } from 'express'
import { obtenerListadoDePaisesController } from '../controllers/paisesControllers.mjs'
import { procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController, procesoEliminarPaisesAgregadosEnMongoDBController } from '../controllers/paisesControllers.mjs'
import { vistaPanelDeControlController, vistalFormAgregarPaisController } from '../controllers/paisesControllers.mjs'
import { agregarNuevoPaisController } from '../controllers/paisesControllers.mjs'
import { sanitizarPeticionBody } from '../middlewares/sanitizadorGlobal.mjs'
import { parseStringToArray } from '../middlewares/parseStringToArray.mjs'
import { parseArrayToObject } from '../middlewares/parseArrayToObject.mjs'
import { agregarValidationRules } from '../middlewares/validationRules.mjs'
import { handleValidationErros } from '../middlewares/handleValidationErros.mjs'


const router = Router()

router.get('/paises', obtenerListadoDePaisesController)
router.post('/paises/cargarPaises', procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController)
router.post('/paises/nuevoPais', parseStringToArray, parseArrayToObject, sanitizarPeticionBody, agregarValidationRules(), handleValidationErros, agregarNuevoPaisController)
router.delete('/paises/eliminarPaises', procesoEliminarPaisesAgregadosEnMongoDBController)


// Panel de Control
router.get('/paises/panelDeControl', vistaPanelDeControlController)

// Formularios
router.get('/paises/formAgregar', vistalFormAgregarPaisController)

export default router