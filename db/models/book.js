'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.belongsTo(models.Author, {
        foreignKey: 'author_id',
        as: 'Author',
   
      });
    
      Book.belongsTo(models.Work, {
        foreignKey: 'work_id',
        as: 'Work',

      });
    }
    
  }
  Book.init({
    key: DataTypes.STRING,
    title: DataTypes.STRING,
    isbn10: DataTypes.BIGINT,
    isbn13: DataTypes.BIGINT,
    pages: DataTypes.INTEGER,
    publisher: DataTypes.STRING,
    author_id: DataTypes.INTEGER,
    work_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};