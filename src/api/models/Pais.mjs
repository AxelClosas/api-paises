import mongoose from "mongoose"

const paisSchema = new mongoose.Schema({
  nombreOficial: { type: String, minlength: 3, maxlength: 90, required: true },
  capital: { type: String, minlength: 3, maxlength: 90, required: true },
  continente: { type: String, minlength: 3, maxlength: 90, required: true },
  subContinente: { type: String, minlength: 3, maxlength: 90, required: true },
  idiomas: { type: Map, of: String },
  fronteras: { type: [String], maxlength: 3 },
  area: { type: Number, min: 0, max: 20000000 },
  mapas: { googleMaps: String, openStreetMaps: String },
  poblacion: { type: Number, min: 0 },
  gini: { type: Map, of: Number },
  zonasHorarias: [String],
  banderas: { type: Map, of: String, required: true },
  creadoPor: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now }
})

const Pais = mongoose.Model('Pais', paisSchema, 'Grupo-04')

export default Pais