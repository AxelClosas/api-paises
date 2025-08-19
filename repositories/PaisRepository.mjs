import IRepository from "./IRepository.mjs"
import Pais from '../models/Pais.mjs'

class PaisRepository extends IRepository {
  async obtenerPorId(id) {
    return await Pais.findById(id)
  }
  // De momento no le encuentro utilidad para la aplicación actual
  // async obtenerTodos() {
  //   return await Pais.find({})
  // }

  async agregar(pais) {
    return await Pais.create(pais)
  }

  async actualizar(id, atributos) {
    return await Pais.findByIdAndUpdate(id, atributos, { new: true })
  }

  async buscarPorAtributo(atributo, valor) {
    return await Pais.find({ [atributo]: valor })
  }

  async buscarPorQuery(query) {
    return await Pais.find(query)
  }

  async eliminar(id) {
    return await Pais.findByIdAndDelete(id)
  }
}

export default new PaisRepository()