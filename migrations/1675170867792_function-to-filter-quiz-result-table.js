/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE OR REPLACE FUNCTION get_quiz_result_rows_by_string(where_clause_str TEXT)
        RETURNS TABLE (id INTEGER, quiz INTEGER, score INTEGER, participant INTEGER) AS $$
        BEGIN
            RETURN QUERY EXECUTE format('SELECT id, quiz, score, participant FROM quiz_result WHERE %s', where_clause_str);
        END;
        $$ LANGUAGE plpgsql;   
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP FUNCTION get_quiz_result_rows_by_string(text)
    `)
};
