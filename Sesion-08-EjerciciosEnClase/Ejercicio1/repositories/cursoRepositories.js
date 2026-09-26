const { Curso } = require('../models');

class CursoRepository {
  async findAll() {
    return await Curso.findAll();
  }

  async findByCodigo(codigo) {
    return await Curso.findOne({ where: { codigo } });
  }

  async create(cursoData) {
    return await Curso.create(cursoData);
  }
}

module.exports = new CursoRepository();