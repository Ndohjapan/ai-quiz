/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.sql(`
        CREATE OR REPLACE FUNCTION update_user_by_id(id INTEGER, json_data json)
        RETURNS void AS $$
        DECLARE
            update_query text;
            field text;
            json_value text;
        BEGIN
            update_query := 'UPDATE users SET ';
            FOR field IN (SELECT json_object_keys(json_data)) LOOP
                json_value:=(json_data->>field);
                update_query := update_query || field || ' = ''' || json_value || ''',';
            END LOOP;
            update_query := left(update_query, length(update_query) - 1);
            update_query := update_query || ' WHERE id = ' || id::text;
            EXECUTE update_query;
        END;
        $$ LANGUAGE plpgsql;
        
    `)

};

exports.down = pgm => {
    pgm.sql(`
        DROP FUNCTION update_user_by_id(INTEGER, JSON);
    `)
};
