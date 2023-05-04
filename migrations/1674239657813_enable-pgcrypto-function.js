/* eslint-disable camelcase */

exports.shorthands = undefined;

const bcrypt = require("bcrypt")

exports.up = pgm => {
    pgm.sql(`

        CREATE EXTENSION pgcrypto;

    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP EXTENSION pgcrypto;
    `)
};
