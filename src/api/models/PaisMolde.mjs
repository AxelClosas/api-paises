export default class PaisMolde {
  constructor({
      nombreOficial,
      capital,
      continente,
      subContinente,
      idiomas,
      fronteras,
      area,
      mapas,
      poblacion,
      gini,
      zonasHorarias,
      banderas,
      creadoPor
    }) {
    this.nombreOficial = nombreOficial
    this.capital = capital
    this.continente = continente
    this.subContinente = subContinente
    this.idiomas = idiomas
    this.fronteras = fronteras
    this.area = area
    this.mapas = mapas
    this.poblacion = poblacion
    this.gini = gini
    this.zonasHorarias = zonasHorarias
    this.banderas = banderas
    this.creadoPor = creadoPor
  }
}