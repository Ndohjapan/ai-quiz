/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        ALTER TABLE QUIZ
        ADD COLUMN TIMER INTEGER NOT NULL DEFAULT 10
    `)
};

exports.down = pgm => {
    pgm.sql(`
        ALTER TABLE quiz
        DROP COLUMN TIMER
    `)
};
