const Sequelize = require('sequelize')
const connection = require('../../database/database')
const moment = require('moment')

const User = connection.define('users', {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
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

User.sync({ force: false })

module.exports = User;