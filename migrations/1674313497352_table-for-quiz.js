/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE QUIZ(
            ID serial PRIMARY KEY,
            CREATOR integer NOT NULL REFERENCES USERS(ID) ON DELETE CASCADE,
            CATEGORY integer NOT NULL REFERENCES QUIZ_CATEGORY(ID) ON DELETE SET NULL,
            DIFFICULTY integer NOT NULL REFERENCES QUIZ_DIFFICULTY(ID) ON DELETE SET NULL,
            QUIZ_TYPE varchar NOT NULL,
            CREATED_AT timestamp NOT NULL DEFAULT NOW(),
            EXPECTED_PARTICIPANTS integer NOT NULL DEFAULT 1
        );
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE QUIZ
    `)
};
