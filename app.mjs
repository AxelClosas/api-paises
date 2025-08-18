import express from 'express'
import dotenv from 'dotenv'
import { conectarBD } from './src/api/config/dbConfig.mjs'


// Se importa la configuración de nuestra variable de entorno
dotenv.config()

// Se instancia la aplicación express
const app = express()

// Se define el puerto desde la variable de entorno, caso contrario se utiliza el puerto 3001
const PORT = process.env.PORT || 3001

// Middleware para trabajar con JSON
app.use(express.json())

// Conexión a la Base de Datos
conectarBD()


app.get('/', (req, res) => {
  res.status(200).send({
    msg: "Servidor funcionando correctamente"
  })
})

app.listen(PORT, () => {
  console.log("API PAISES")
  console.log(`http://localhost:${PORT}`)
})