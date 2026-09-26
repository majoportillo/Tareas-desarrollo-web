const { body, validationResult } = require('express-validator');
const cursoRepository = require('../repositories/cursoRepository');

const validarCrearCurso = [
  body('nombre')
    .notEmpty().withEl('El nombre es obligatorio')
    .isString().withEl('El nombre debe ser un texto'),
  
  body('codigo')
    .notEmpty().withMessage('El código único es obligatorio')
    .custom(async (codigo) => {
      const existe = await cursoRepository.findByCodigo(codigo);
      if (existe) {
        throw new Error('El código del curso ya está registrado');
      }
    }),

  body('creditos')
    .notEmpty().withMessage('Los créditos son obligatorios')
    .isInt({ min: 1 }).withMessage('Los créditos deben ser un número entero mayor o igual a 1'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validarCrearCurso };