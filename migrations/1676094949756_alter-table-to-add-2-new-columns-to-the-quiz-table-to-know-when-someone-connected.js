/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        ALTER TABLE quiz
        ADD COLUMN started BOOLEAN DEFAULT false NOT NULL,
        ADD COLUMN connected INTEGER DEFAULT 1 NOT NULL,
        ADD COLUMN questions_id INTEGER REFERENCES QUESTIONS(ID) ON DELETE CASCADE;
    `)
};

exports.down = pgm => {
    pgm.sql(`
        ALTER TABLE quiz
        DROP COLUMN started,
        DROP COLUMN connected, 
        DROP COLUMN questions_id, 
    `)
};
