import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import expressLayouts from 'express-ejs-layouts'
import { conectarBD } from './config/dbConfig.mjs'
import paisesRoutes from './routes/paisesRoutes.mjs'

// Se importa la configuración de nuestra variable de entorno
dotenv.config()

// Se instancia la aplicación express
const app = express()

// Se define el puerto desde la variable de entorno, caso contrario se utiliza el puerto 3001
const PORT = process.env.PORT || 3001

// Middleware para trabajar con JSON
app.use(express.json())

// Middleware para trabajar con formularios HTML
app.use(express.urlencoded({ extended: true }))

/* Middleware para servir archivos estáticos */
app.use(express.static(path.resolve('./public')))

// Configuramos la ruta para acceder a la api
app.use('/api', paisesRoutes)

// Se configura EJS como Motor de Vistas
app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

// Se configura expressLayouts
app.use(expressLayouts)
app.set('layout', 'layout')




// Conexión a la Base de Datos
conectarBD()


app.get('/', (req, res) => {
  res.status(200).render('index', { title: 'Página Principal'})
})

app.listen(PORT, () => {
  console.log("API PAISES")
  console.log(`http://localhost:${PORT}`)
})