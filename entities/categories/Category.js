const Sequelize = require('sequelize')
const connection = require('../../database/database')

const Category = connection.define('categories', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('createdAt')).format('DD/MM/YYYY HH:mm:ss');
    }
  },
  updatedAt: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('updatedAt')).format('DD/MM/YYYY HH:mm:ss');
    }
  }
})

Category.sync({ force: false }).then(() => { })

module.exports = Category