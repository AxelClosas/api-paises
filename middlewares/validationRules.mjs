import { body } from 'express-validator'

export const agregarValidationRules = (req, res) => [
  body('nombreOficial')
    .trim()
    .escape()
    .notEmpty().withMessage('El nombre del País es requerido')
    .isLength( {min: 3, max: 90} ).withMessage('El nombre del País debe tener entre 3 y 90 caracteres.'),

  body('capital')
    .trim()
    .escape()
    .notEmpty().withMessage('El nombre de la Capital es requerido')
    .isLength( {min: 3, max: 90} ).withMessage('El nombre de la Capital debe tener entre 3 y 90 caracteres.'),

  body('continente')
    .trim()
    .escape()
    .notEmpty().withMessage('El nombre del Continente es requerido')
    .isLength( {min: 3, max: 90} ).withMessage('El nombre del Continente debe tener entre 3 y 90 caracteres.'),

  body('subContinente')
    .trim()
    .escape()
    .notEmpty().withMessage('El nombre del subContinente es requerido')
    .isLength( {min: 3, max: 90} ).withMessage('El nombre del subContinente debe tener entre 3 y 90 caracteres.'),

  body('idiomas')
    .isArray().withMessage('La lista de idiomas debe ser un array.'),
  body('idiomas.*')
    .isString().withMessage('Cada idioma debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('Los idiomas no pueden estar vacíos.'),

  body('fronteras')
    .isArray().withMessage('La lista de fronteras debe ser un array.'),
  body('fronteras.*')
    .isString().withMessage('Cada fronteras debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('Las fronteras no pueden estar vacíos.')
    .isLength( {min: 3, max: 3} ).withMessage('La sigla de la frontera debe tener 3 caracteres.'),

  body('area')
  .notEmpty().withMessage('El área del País es requerida.')
  .isInt({min: 0}).withMessage('Solo se pueden ingresar valores enteros positivos.'),

  body('mapas.googleMaps')
    .notEmpty().withMessage('Google Maps es requerido')
    .isURL().withMessage('Google Maps debe ser una URL válida'),  
  body('mapas.openStreetMaps')
    .notEmpty().withMessage('OpenStreetMaps es requerido')
    .isURL().withMessage('OpenStreetMaps debe ser una URL válida'),
  
  body('poblacion')
    .notEmpty().withMessage('La población del País es requerida.')
    .isInt({min: 0}).withMessage('Solo se pueden ingresar valores enteros positivos.'),

  body('gini')
  .optional()
  .custom((value) => {
    // Verificar que todos los valores sean números
    for (const [key, val] of Object.entries(value)) { // Por cada llave-valor de las entradas del objeto
      if (typeof val !== 'number') { // Si el tipo de val es distinto de number, retorna el error.
        throw new Error(`El valor de ${key} debe ser un número`)
      }
      if (val < 0 || val > 100) { // Si el valor es menor a 0 o mayor a 100 retorna el error.
        throw new Error(`El valor de ${key} debe estar entre 0 y 100`)
      }
    }
    return true
  }),

  body('zonasHorarias')
    .isArray().withMessage('La lista de zonasHorarias debe ser un array.'),
  body('zonasHorarias.*')
    .isString().withMessage('Cada zona horaria debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('Las zonas horarias no pueden estar vacías.'),

  body('banderas')
    .exists().withMessage('El objeto banderas es requerido')
    .isObject().withMessage('banderas debe ser un objeto')
    .custom(value => {
      // Verificar que no esté vacío
      if (Object.keys(value).length === 0) {
        throw new Error('El objeto banderas no puede estar vacío')
      }
      return true
    }),
  body('banderas.png')
    .optional(),
  
  body('banderas.svg')
  .optional(),

  body('creadoPor')
    .trim()
    .escape()
    .notEmpty().withMessage('El nombre del creador es requerido')
]