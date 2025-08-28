import mongoose from "mongoose"

const paisSchema = new mongoose.Schema({
  nombreOficial: { type: String, minlength: 3, maxlength: 90, required: true },
  capital: { type: [String], min: 1, minlength: 3, maxlength: 90, required: true },
  continente: { type: String, minlength: 3, maxlength: 90, required: true },
  subContinente: { type: String, minlength: 3, maxlength: 90, required: true },
  idiomas: { type:[String], required: true },
  fronteras: { type: [String], minlength:3, maxlength: 3 },
  area: { type: Number, min: 0, required: true },
  mapas: { googleMaps: { type: String, required: true }, openStreetMaps: { type: String, required: true } },
  poblacion: { type: Number, min: 0, required: true },
  gini: { type: Map, of: Number },
  zonasHorarias: {type: [String], required: true },
  banderas: { type: Map, of: String, required: true },
  creadoPor: { type: String, required: true },
  nombreApi: { type: String, default: 'api-paises' },
  fechaCreacion: { type: Date, default: Date.now }
})

const Pais = mongoose.model('Pais', paisSchema, 'Grupo-04')
export default Pais