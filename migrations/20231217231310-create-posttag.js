'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postId: { type: Sequelize.INTEGER, references: { model: 'Posts', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      tagId: {
        type: Sequelize.INTEGER, references: { model: 'Tags', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PostTags');
  }
};
