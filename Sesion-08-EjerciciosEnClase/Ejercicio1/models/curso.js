const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Curso = sequelize.define('Curso', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    creditos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  }, {
    tableName: 'cursos',
    timestamps: true,
  });

  return Curso;
};