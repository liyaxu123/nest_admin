export enum ConfigEnum {
  NEST_SERVER_PORT = 'nest_server_port',

  REDIS_HOST = 'redis_server_host',
  REDIS_PORT = 'redis_server_port',
  REDIS_DATABASE = 'redis_server_database',

  DB_TYPE = 'db_type',
  MYSQL_HOST = 'mysql_server_host',
  MYSQL_PORT = 'mysql_server_port',
  MYSQL_DATABASE = 'mysql_server_database',
  MYSQL_USERNAME = 'mysql_server_username',
  MYSQL_PASSWORD = 'mysql_server_password',

  EMAIL_HOST = 'nodemailer_host',
  EMAIL_PORT = 'nodemailer_port',
  EMAIL_AUTH_USER = 'nodemailer_auth_user',
  EMAIL_AUTH_PASS = 'nodemailer_auth_pass',

  JWT_SECRET = 'jwt_secret',
  JWT_ACCESS_TOKEN_EXPIRES_TIME = 'jwt_access_token_expires_time',
  JWT_REFRESH_TOKEN_EXPIRES_TIME = 'jwt_refresh_token_expres_time',
}

export enum LogEnum {
  LOG_LEVEL = 'LOG_LEVEL',
  LOG_ON = 'LOG_ON',
}
