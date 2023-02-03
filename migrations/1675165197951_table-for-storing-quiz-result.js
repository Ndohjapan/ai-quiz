/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE QUIZ_RESULT(
            id serial primary key,
            quiz_id integer NOT NULL REFERENCES QUIZ(ID) ON DELETE CASCADE,
            user_id integer NOT NULL REFERENCES USERS(ID) ON DELETE CASCADE,
            score integer
        )
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE QUIZ_RESULT CASCADE
    `)
};
