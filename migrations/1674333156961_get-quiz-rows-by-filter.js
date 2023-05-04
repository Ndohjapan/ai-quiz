/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE OR REPLACE FUNCTION get_quiz_by_json(json_data json)
        RETURNS TABLE (difficulty INTEGER, creator INTEGER, category INTEGER, id INTEGER, expected_participants INTEGER, created_at TIMESTAMP, quiz_type VARCHAR) AS $$
        DECLARE
            query text;
            key text;
            value text;
        BEGIN
            query := 'SELECT * FROM quiz WHERE ';
            FOR key, value IN (SELECT * FROM json_each(json_data)) LOOP
                query := query || key || ' = ''' || value || ''' AND ';
            END LOOP;
            query := left(query, length(query) - 5);
            RETURN QUERY EXECUTE query;
        END;
        $$ LANGUAGE plpgsql;    
    
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP FUNCTION get_quiz_by_json(json)
    `)
};
