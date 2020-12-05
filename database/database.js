const Sequelize = require('sequelize')

const connection = new Sequelize(
  'guiapress',
  'root',
  'admin',
  {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00',
    define: {
      charset: 'utf8mb4',
      dialectOptions: {
        collate: 'utf8mb4_general_ci'
      }
    }
  }
)

module.exports = connection