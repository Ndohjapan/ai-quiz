/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE QUIZ_RESULT(
            id serial primary key,
            participant integer NOT NULL REFERENCES USERS(ID) ON DELETE CASCADE,
            quiz integer NOT NULL REFERENCES QUIZ(ID) ON DELETE CASCADE,
            score integer
        )
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DELETE TABLE QUIZ_RESULT CASCADE
    `)
};
