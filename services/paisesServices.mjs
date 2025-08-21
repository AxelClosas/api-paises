import axios from 'axios'
import PaisRepository from "../repositories/PaisRepository.mjs"
import PaisMolde from '../models/PaisMolde.mjs'


async function obtenerDatosAPIOriginal() {
  let respuesta = null
  try {
    console.log('Realizando petición al endpoint:', process.env.ENDPOINT_PAISES)
    respuesta = await axios.get(process.env.ENDPOINT_PAISES)
    if (respuesta.status === 200) {
      console.log('Retornando datos originales')
      return [...respuesta.data.values()]
    } else {
      return respuesta = []
    }
  } catch (error) {
    throw Error('Se produjo un error al realizar la petición al endpoint: ', error)
  }
}

const esUndefined = obj => obj === undefined ? false : true

async function modelarDatosAPIOriginal() {
  try {
    const paises = await obtenerDatosAPIOriginal()
    if (paises.length) {
      console.log('Cantidad de países:', paises.length)
      console.log('Filtrando paises con idioma español')
      const paisesConIdiomaEspaniol = paises.filter(pais => pais.languages.hasOwnProperty('spa'))
      console.log('Cantidad de países con Idioma Español:', paisesConIdiomaEspaniol.length)

      console.log('Mapeando paises con el Objeto PaisMolde')
      const paisesMapeados = paisesConIdiomaEspaniol.map(pais => {
        return new PaisMolde({
          nombreOficial: pais.name.nativeName.spa.official,
          capital: pais.capital,
          continente: pais.region,
          subContinente: pais.subregion,
          idiomas: pais.languages,
          fronteras: esUndefined(pais.borders) ? pais.borders.map(f => String(f).toUpperCase()) : [],
          area: Number(pais.area),
          mapas: pais.maps,
          poblacion: Number(pais.population),
          gini: pais.gini,
          zonasHorarias: pais.timezones,
          banderas: pais.flags,
          creadoPor: 'Axel Closas'
        })
      })
      console.log('Cantida de paises mapeados:', paisesMapeados.length)
      return paisesMapeados
    }
    return paises
  } catch (error) {
    throw Error('No se pudo completar el modelado de datos:', error)
  }
}


export async function procesoGuardarPaisesDesdeAPIOriginalEnMongoDB() {
  try {
    const paises = await modelarDatosAPIOriginal()
    if (paises.length > 0) {
      const paisesEnBD = await obtenerListadoDePaises()
      const paisesNoDuplicados = paises.filter(pais => {
        let esDuplicado = true
        paisesEnBD.forEach(paisBD => {
          if (pais.nombreOficial === paisBD.nombreOficial)
            esDuplicado = false
        })
        return esDuplicado
      })

      if (paisesNoDuplicados.length === 0)
        throw Error('No se pueden duplicar los registros de los países')

      console.log('Agregando paises a la Base de Datos MongoDB')
      console.log('Cantidad de países a agregar:', paisesNoDuplicados.length)
      paisesNoDuplicados.forEach( async pais => {
        console.log('Agregando país:', pais.nombreOficial)
        await agregarPais(pais)
      })
    } else {
      throw new Error('No hay paises para agregar a la Base de Datos MongoDB')
    }
  } catch (error) {
    throw new Error('No se pudo guardar los paises en MongoDB: ', error)
  }
}

export async function procesoEliminarPaisesAgregadosEnMongoDB() {
  const paises = await obtenerListadoDePaises()
  if (paises.length > 0) {
    let cantPaises = paises.length

    console.log('Cantidad de países para eliminar:', cantPaises)
    paises.forEach( async pais => await eliminarPais( pais._id ) )
  }
}

export function obtenerMayorGini(gini) {
  if (typeof gini !== 'undefined') {
    const ginis = []
    for (const [key, value] of gini) {
      ginis.push(Number(key)) // Guardo los años disponibles
    }    
    let mayor = 0 // Se declara e inicializa la variable mayor para guardar el último año
    ginis.forEach(e => e > mayor ? mayor = e : mayor) // Comparo cada elemento con mayor y guardo el más alto
    
    return gini.get(String(mayor)) // Casteo a String el año obtenido
  } else {
    return 'Sin Dato' // Retorna sin dato en caso de que gini sea undefined
  }
}
export function obtenerCantidadGini(paises) {
  let cant = 0
  paises.forEach(pais => typeof obtenerMayorGini(pais.gini) !== 'string' ? cant++ : cant+=0)
  return cant
}

export function obtenerSumatoriaAtributo(paises, atributo) {
  let sum = 0
  paises.forEach(pais => sum += Number(pais[atributo]) )
  return sum
}

export function promedioGini(paises) {
  let sumGini = 0
  paises.forEach(pais => typeof obtenerMayorGini(pais.gini) !== 'string' ? sumGini += obtenerMayorGini(pais.gini) : sumGini)
  const cantGini = obtenerCantidadGini(paises)
  const promedioGini = cantGini !== 0 ? sumGini / cantGini : 0
  return promedioGini
}



export async function obtenerListadoDePaises() {
  const queryEstandar = { nombreApi: 'api-paises', creadoPor: 'Axel Closas' }
  return await PaisRepository.buscarPorQuery(queryEstandar)
}


export async function agregarPais(pais) {
  return await PaisRepository.agregar(pais)
}


async function filtrarPaisesPorQuery(query) {
  return await PaisRepository.buscarPorQuery(query)
}

export async function eliminarPais(id) {
  return await PaisRepository.eliminar(id)
}
