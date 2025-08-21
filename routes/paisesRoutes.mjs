import { Router } from 'express'
import { obtenerListadoDePaisesController } from '../controllers/paisesControllers.mjs'
import { procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController, procesoEliminarPaisesAgregadosEnMongoDBController } from '../controllers/paisesControllers.mjs'
import { handleValidationErros } from '../middlewares/handleValidationErros.mjs'

const router = Router()

router.get('/paises', obtenerListadoDePaisesController)
router.get('/paises/cargarPaises', procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController)
router.get('/paises/eliminarPaises', procesoEliminarPaisesAgregadosEnMongoDBController)

export default router