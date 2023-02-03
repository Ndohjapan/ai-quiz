/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE QUESTIONS( 
            ID serial PRIMARY KEY,
            CATEGORY INTEGER NOT NULL REFERENCES QUIZ_CATEGORY(ID) ON DELETE SET NULL,
            DIFFICULTY INTEGER NOT NULL REFERENCES QUIZ_DIFFICULTY(ID) ON DELETE SET NULL,
            QUESTIONS VARCHAR(2000) NOT NULL
        );
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE QUESTIONS CASCADE
    `)
};
