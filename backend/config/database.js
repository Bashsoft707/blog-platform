require('dotenv').config();

module.exports = {
    database: process.env.DB_NAME || 'your_database_name',
    username: process.env.DB_USER || 'your_database_user',
    password: process.env.DB_PASS || 'your_database_password',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
};