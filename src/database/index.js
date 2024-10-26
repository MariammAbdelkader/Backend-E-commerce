const { Sequelize } = require('sequelize');
const { DB_DATABASE, DB_USER, DB_HOST, DB_PORT, DB_PASSWORD } = require('../config');

const db =  new Sequelize({
    dialect : "postgres" ,
    username : DB_USER ,
    host : DB_HOST ,
    port : DB_PORT , 
    password : DB_PASSWORD ,
    database : DB_DATABASE ,
    logging: false,
//   dialectOptions: {
//     // ssl: {
//     //   require: true, // This is a security feature to ensure that the connection is encrypted.
//     //   rejectUnauthorized: false, // It's important to handle SSL verification securely in production environments.
//     // },
//   },
})

module.exports = { db };
