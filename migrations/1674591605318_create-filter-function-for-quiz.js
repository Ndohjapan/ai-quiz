/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE OR REPLACE FUNCTION get_rows_by_string(where_clause_str TEXT)
        RETURNS TABLE (id INTEGER, creator INTEGER, category INTEGER, difficulty INTEGER, quiz_type character varying, craeted_at timestamp without time zone, expected_participants integer) AS $$
        BEGIN
            RETURN QUERY EXECUTE format('SELECT id, creator, category, difficulty, quiz_type, created_at, expected_participants FROM quiz WHERE %s', where_clause_str);
        END;
        $$ LANGUAGE plpgsql;   
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP FUNCTION get_rows_by_string(text)
    `)
};
