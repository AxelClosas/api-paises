class IRepository {
  obtenerPorId(id) {
    throw new Error("Método 'obtenerPorId()' no implementado")
  }
  
  obtenerTodos() {
    throw new Error("Método 'obtenerTodos()' no implementado")
  }

  agregar(pais) {
    throw new Error("Método 'agregar()' no implementado")
  }

  actualizar(id, atributos) {
    throw new Error("Método 'actualizar()' no implementado")
  }

  eliminar(id) {
    throw new Error("Método 'eliminar()' no implementado")
  }
}

export default IRepository