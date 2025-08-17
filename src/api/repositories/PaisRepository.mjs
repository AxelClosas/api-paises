import IRepository from "./IRepository.mjs"
import Pais from '../models/Pais.mjs'

class PaisRepository extends IRepository {
  async obtenerPorId(id) {
    return await Pais.findById(id)
  }
  
  async obtenerTodos() {
    return await Pais.find({})
  }

  async agregar(pais) {
    return await Pais.create(pais)
  }

  async actualizar(id, atributos) {
    return await Pais.findByIdAndUpdate(id, atributos, { new: true })
  }

  async eliminar(id) {
    return await Pais.findByIdAndDelete(id)
  }
}

export default new PaisRepository()