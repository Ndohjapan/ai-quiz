/* eslint-disable camelcase */

exports.shorthands = undefined;

const dotenv = require("dotenv")

dotenv.config()

exports.up = pgm => {

    pgm.sql(`
        CREATE OR REPLACE FUNCTION hash_password(input_password text)
        RETURNS text AS $$
        BEGIN
        RETURN crypt(input_password, 'salt');
        END;
        $$ LANGUAGE plpgsql;
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP FUNCTION hash_password;
    `)
};
