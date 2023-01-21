/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        ALTER TABLE quiz ADD CONSTRAINT check_expected_participants CHECK (quiz_type != 'single' OR expected_participants = 1);
    `)
};

exports.down = pgm => {
    pgm.sql(`
        ALTER TABLE quiz DROP CONSTRAINT check_expected_participants;
    `)
};
