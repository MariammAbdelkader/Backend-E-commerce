require('dotenv').config();

const { PORT , DB_HOST , DB_PORT , DB_USER , DB_PASSWORD , DB_DATABASE , HASH_SALT_ROUNDS } = process.env;
module.exports = { PORT , DB_HOST , DB_PORT , DB_USER , DB_PASSWORD , DB_DATABASE , HASH_SALT_ROUNDS};