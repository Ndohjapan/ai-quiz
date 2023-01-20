/* eslint-disable camelcase */

exports.shorthands = undefined;

const dotenv = require("dotenv")

dotenv.config()

exports.up = pgm => {

    pgm.sql(`
        CREATE OR REPLACE FUNCTION hash_password(input_password text)
        RETURNS text AS $$
        BEGIN
        RETURN crypt(input_password, gen_salt('${process.env.SALT_SEED}'));
        END;
        $$ LANGUAGE plpgsql;
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP FUNCTION check_password;
    `)
};
