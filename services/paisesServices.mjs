import axios from 'axios'
import PaisRepository from "../repositories/PaisRepository.mjs"
import PaisMolde from '../models/PaisMolde.mjs'



async function modelarDatosAPIOriginal({paises, creador}) {
  const esUndefined = obj => obj === undefined ? false : true
  console.log('Filtrando paises con idioma español')
  const paisesConIdiomaEspaniol = paises.filter(pais => pais.languages.hasOwnProperty('spa'))
  console.log('Cantidad de países con Idioma Español:', paisesConIdiomaEspaniol.length)
  console.log('Mapeando paises con el Objeto PaisMolde')

  return paisesConIdiomaEspaniol.map(pais => {
    console.log(pais.name.nativeName.spa.official || pais.name.official)
    return new PaisMolde({
      nombreOficial: pais.name.nativeName.spa.official || pais.name.official,
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
      creadoPor: creador
    })})
}


export async function procesoGuardarPaisesDesdeAPIOriginalEnMongoDB() {
  try {
    console.log('Realizando petición al endpoint:', process.env.ENDPOINT_PAISES)
    const response = await axios.get(process.env.ENDPOINT_PAISES)
    if (response.status === 200) {
      const paises = await modelarDatosAPIOriginal({paises: response.data, creador: 'Axel Closas'})
      paises.forEach(pais => console.log('Despues de mapeo:', pais.nombreOficial))
      const paisesEnBD = await obtenerListadoDePaises()
      const paisesNoDuplicados = paises.filter(pais => {
        let esDuplicado = true
        paisesEnBD.forEach(paisBD => pais.nombreOficial === paisBD.nombreOficial ? esDuplicado = false : esDuplicado = true)
        return esDuplicado
      })
  
      if (paisesNoDuplicados.length === 0)
        throw new Error('No se pueden duplicar los registros de los países')
      
      console.log('Agregando paises a la Base de Datos MongoDB')
      console.log('Cantidad de países a agregar:', paisesNoDuplicados.length)
  
      paisesNoDuplicados.forEach( async pais => {
        console.log('Agregando país:', pais.nombreOficial)
        await agregarPais(pais)
      })
    }
  } catch (error) {
    if(error.response) {
      // Error del servidor con status
      throw {
        status: error.response.status,
        message: error.response.data?.message || "Error en la API externa"
      }
    } else if ( error.request ){
      // No hubo respuesta
      throw { 
        status: 503,
        message: "No se recibió respuesta del servidor externo"
      }
    } else {
      // Error desconocido
      throw {
        status: 500,
        message: "Error interno al llamar a la API externa",
      }
    }
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
