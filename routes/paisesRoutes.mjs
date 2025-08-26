import { Router } from 'express'
import { obtenerListadoDePaisesController } from '../controllers/paisesControllers.mjs'
import { procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController, procesoEliminarPaisesAgregadosEnMongoDBController } from '../controllers/paisesControllers.mjs'
import { vistaPanelDeControlController, vistalFormAgregarPaisController } from '../controllers/paisesControllers.mjs'
import { agregarNuevoPaisController } from '../controllers/paisesControllers.mjs'


const router = Router()

router.get('/paises', obtenerListadoDePaisesController)
router.post('/paises/cargarPaises', procesoGuardarPaisesDesdeAPIOriginalEnMongoDBController)
router.post('/paises/nuevoPais', agregarNuevoPaisController)
router.delete('/paises/eliminarPaises', procesoEliminarPaisesAgregadosEnMongoDBController)


// Panel de Control
router.get('/paises/panelDeControl', vistaPanelDeControlController)

// Formularios
router.get('/paises/formAgregar', vistalFormAgregarPaisController)

export default router