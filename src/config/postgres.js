const { Pool } = require("pg");
const serverConfig = require("./serverConfigs");
const env = process.env.NODE_ENV || "dev";

class Query {
  constructor(query, conn) {
    this.query = query;
    this.conn = conn;
  }

  param(name, value) {
    this.query = this.query.replace(`:${name}`, value);

    return this;
  }

  paramObject(value, prefix) {
    for (let i in value) {
      this.param(`${prefix && prefix.length ? prefix : ""}${i}`, value[i]);
    }

    return this;
  }

  async execute() {
    if (this.query && this.query.length) {
      let result = await this.conn.query(this.query);

      return result.rows;
    } else {
      throw { message: "Query não informada!" };
    }
  }

  async executeOne() {
    if (this.query && this.query.length) {
      let result = await this.conn.query(this.query);

      if (result.rows.length > 1)
        throw {
          message: "Mais de um resultado foi retornado!",
          results: result.rows,
        };

      return result.rows[0];
    } else {
      throw { message: "Query não informada!" };
    }
  }
}

class Pg {
  constructor(config) {
    this.conn = new Pool(config);
    this.TransactionClass = () => new TransactionClass(this);
  }

  async query(script) {
    let result = await this.conn.query(script);

    return result.rows;
  }

  request(query) {
    this.reqQuery = new query(query, this.conn);

    return this.reqQuery;
  }
}

class TransactionClass {
  constructor(pg) {
    this.pg = pg.conn.connect();
    this.init();
  }

  async connect() {
    if (!this.pg || !this.pg.query) {
      this.pg = await this.pg;
    }
  }

  async query(script) {
    try {
      await this.connect();

      return await this.pg.query(script);
    } catch (e) {
      await this.rollback();
      throw e;
    }
  }

  async init() {
    return await this.query("BEGIN");
  }

  async commit() {
    let result = await this.pg.query("COMMIT");
    await this.pg.release();
    return result;
  }

  async rollback() {
    return await this.pg.query("ROLLBACK");
  }

  async request(query) {
    try {
      return await this.pg.request(query);
    } catch (e) {
      await this.rollback();
      throw err;
    }
  }
}

module.exports = (name = "PG") => {
  let config = serverConfig.database.postgres[env];
  if (!global.databaseConnections) global.databaseConnections = {};

  if (!global.databaseConnections[name])
    global.databaseConnections[name] = new Pg(config);

  global.databaseConnections[name].conn.on("error", (err, client) => {
    console.log(err);
  });

  return global.databaseConnections[name];
};
