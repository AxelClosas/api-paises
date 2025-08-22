import { Router } from 'express'
import { obtenerListadoDePaisesController } from '../controllers/paisesControllers.mjs'
import { procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController, procesoEliminarPaisesAgregadosEnMongoDBController } from '../controllers/paisesControllers.mjs'
import { handleValidationErros } from '../middlewares/handleValidationErros.mjs'

const router = Router()

router.get('/paises', obtenerListadoDePaisesController)
router.post('/paises/cargarPaises', procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController)
router.delete('/paises/eliminarPaises', procesoEliminarPaisesAgregadosEnMongoDBController)

export default router