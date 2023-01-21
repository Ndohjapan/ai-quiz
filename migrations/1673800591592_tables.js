/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.sql(`
        CREATE TABLE USERS( 
            ID serial PRIMARY KEY,
            USERNAME VARCHAR(50) UNIQUE NOT NULL,
            FIRSTNAME VARCHAR(100) NOT NULL,
            LASTNAME VARCHAR(100) NOT NULL,
            PASSWORD VARCHAR(200) NOT NULL,
            OTP_EXPIRES_IN VARCHAR(50) NOT NULL,
            OTP VARCHAR(10) NOT NULL,
            EMAIL VARCHAR(100) UNIQUE NOT NULL,
            VERIFIED BOOLEAN NOT NULL DEFAULT FALSE 
        );
    `)

};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE USERS CASCADE
    `)
};
