/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.sql(`
        CREATE OR REPLACE FUNCTION get_quiz_result_rank(p_quiz_result_id INTEGER)
        RETURNS INTEGER AS $$
        DECLARE
        v_rank INTEGER;
        BEGIN
        SELECT rank
        INTO v_rank
        FROM (
            SELECT *, row_number() OVER (PARTITION BY quiz_id ORDER BY score DESC) as rank 
            FROM quiz_result
        ) as newResult
        WHERE id = p_quiz_result_id;
        
        RETURN v_rank;
        END;
        $$ LANGUAGE plpgsql;
    `)

};

exports.down = pgm => {

    pgm.sql(`
        DROP FUNCTION get_quiz_result_rank(INTEGER)
    `)

};
