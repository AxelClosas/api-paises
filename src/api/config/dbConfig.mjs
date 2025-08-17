import mongoose from "mongoose"

export async function conectarBD() {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('Conexión exitosa a MongoDB')
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error)
    process.exit(-1)
  }
}