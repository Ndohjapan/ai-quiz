/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE QUIZ_CATEGORY (
            ID serial PRIMARY KEY,
            NAME varchar NOT NULL
        );
        
        
        CREATE TABLE QUIZ_DIFFICULTY (
            ID serial PRIMARY KEY,
            NAME varchar
        );
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE QUIZ_CATEGORY, QUIZ_DIFFICULTY CASCADE
    `)
};
