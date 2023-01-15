/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.sql(`
        CREATE TABLE USERS( 
            ID serial PRIMARY KEY,
            UNSERNAME VARCHAR(50) UNIQUE NOT NULL,
            FIRSTNAME VARCHAR(100) NOT NULL,
            LASTNAME VARCHAR(100) NOT NULL,
            EMAIL VARCHAR(100) UNIQUE NOT NULL 
        );
        
        
        CREATE TABLE QUIZ_CATEGORY (
            ID serial PRIMARY KEY,
            NAME varchar NOT NULL
        );
        
        
        CREATE TABLE QUIZ_DIFFICULTY (
            ID serial PRIMARY KEY,
            NAME varchar
        );
        
        CREATE TABLE QUIZ(
            ID serial PRIMARY KEY,
            CREATOR integer NOT NULL REFERENCES USERS(ID) ON DELETE CASCADE,
            CATEGORY integer NOT NULL REFERENCES QUIZ_CATEGORY(ID) ON DELETE SET NULL,
            DIFFICULTY integer NOT NULL REFERENCES QUIZ_DIFFICULTY(ID) ON DELETE SET NULL,
            QUIZ_TYPE varchar NOT NULL,
            CREATED_AT timestamp NOT NULL DEFAULT NOW(),
            EXPECTED_PARTICIPANTS integer NOT NULL DEFAULT 1
        );
        
        CREATE TABLE PARTICIPATIONS(
            ID serial PRIMARY KEY,
            USER_ID integer REFERENCES USERS(ID) ON DELETE CASCADE,
            QUIZ_ID integer REFERENCES QUIZ(ID) ON DELETE CASCADE,
            SCORE integer
        );
    `)

};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE USERS,
            QUIZ,
            QUIZ_CATEGORY,
            QUIZ_DIFFICULTY,
            PARTICIPATIONS
    `)
};
