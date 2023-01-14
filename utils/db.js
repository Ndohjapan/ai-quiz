const pg = require("pg");
const { connect } = require("../app");

class Pool{
    _pool = null;

    connect(options) {
        this._pool = new pg.Pool(options);
        return this._pool.query('SELECT 1 + 1;');
    }

    close() {
        this._pool.end()
    }

    query(sql, params){
        return this._pool.query(sql, params)
    }
}

async function connectDB(){
    let database = new Pool().connect({
        host: process.env.HOST,
        port: process.env.POSTGRESS_PORT,
        database: process.env.DATABASE,
        user: process.env.USER,
        password: process.env.PASSWORD 
    })

    return database
}

module.exports = Pool