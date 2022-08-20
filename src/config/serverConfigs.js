module.exports = {
  secret: "secret",
  envoriment: {
    dev: "desenvolvimento",
    production: "produção",
  },
  server: {
    dev: {
      url: "http://localhost",
      port: 3333,
    },
  },
  database: {
    postgres: {
      dev: {
        user: "postgres",
        host: "localhost",
        database: "yourDatabase",
        password: "1234567890",
        port: 5432,
      }
    },
  },
};
