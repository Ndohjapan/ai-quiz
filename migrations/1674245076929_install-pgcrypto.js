/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE EXTENSION pgcrypto;
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP EXTENSION extension_name;
    `)
};
