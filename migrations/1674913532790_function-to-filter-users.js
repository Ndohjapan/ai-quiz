/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE OR REPLACE FUNCTION get_users_rows_by_string(where_clause_str TEXT)
        RETURNS TABLE (id INTEGER, username character varying, firstname character varying, lastname character varying, password character varying, email character varying, verified boolean) AS $$
        BEGIN
            RETURN QUERY EXECUTE format('SELECT id, username, firstname, lastname, password, email, verified FROM users WHERE %s', where_clause_str);
        END;
        $$ LANGUAGE plpgsql;   
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP FUNCTION get_users_rows_by_string(text)
    `)
};
