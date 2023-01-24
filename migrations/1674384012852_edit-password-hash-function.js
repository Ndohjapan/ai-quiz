/* eslint-disable camelcase */

exports.shorthands = undefined;

const dotenv = require("dotenv")

dotenv.config()

exports.up = pgm => {

    pgm.sql(`
        CREATE OR REPLACE FUNCTION hash_password(password VARCHAR(255))
        RETURNS VARCHAR(255) AS $$
        BEGIN
        RETURN crypt(password, gen_salt('bf'));
        END;
        $$ LANGUAGE plpgsql;    
    
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP FUNCTION hash_password;
    `)
};
