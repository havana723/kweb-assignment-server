export default {
  JWT_SECRET: "<jwt secret>", // Secret key used for JWT encryption.
  SUBJECT: "<jwt subject>", // Subject used for JWT tokenize.
  COOKIE_SECRET: "<cookie secret>",
  TOKEN_EXPIRE: 86400 * 1000, // Expire time of authentication token.
  PORT: 3001, // web server port
  BODY_PARSER_LIMIT: "10mb", // Body parser limit of server.
};
