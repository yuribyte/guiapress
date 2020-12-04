const Sequelize = require('sequelize')
const connection = require('../../database/database')
const Category = require('../categories/Category')
const moment = require('moment')

const Article = connection.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  summary: {
    type: Sequelize.STRING,
    allowNull: true
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

Category.hasMany(Article)
Article.belongsTo(Category)

Article.sync({ force: false }).then(() => { })
Category.sync({ force: false }).then(() => { })

module.exports = Article