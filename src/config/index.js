require('dotenv').config();

const { PORT , DB_HOST , DB_PORT , DB_USER , DB_PASSWORD , DB_DATABASE , HASH_SALT_ROUNDS ,AI_API_URL } = process.env;
module.exports = { PORT , DB_HOST , DB_PORT , DB_USER , DB_PASSWORD , DB_DATABASE , HASH_SALT_ROUNDS,AI_API_URL};