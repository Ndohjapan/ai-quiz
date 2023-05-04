/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`

        CREATE OR REPLACE FUNCTION check_password(input_password text, input_email text)
        RETURNS BOOLEAN AS $$
        DECLARE
            hashed_password text;
        BEGIN
            SELECT password INTO hashed_password FROM users WHERE email = input_email;
            RETURN crypt(input_password, hashed_password) = hashed_password;
        END;
        $$ LANGUAGE plpgsql;
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP FUNCTION check_password;
    `)
};
