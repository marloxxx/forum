'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
      Post.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
      Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' });
      Post.belongsToMany(models.Tag, { through: 'PostTags', foreignKey: 'postId', as: 'tags' });
    }
  }
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};