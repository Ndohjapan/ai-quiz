/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TRIGGER check_quiz_type_expected_participants
        BEFORE INSERT OR UPDATE ON quiz
        FOR EACH ROW
        EXECUTE FUNCTION check_quiz_type_expected_participants();
    
    `)
};

exports.down = pgm => {
    pgm.sql(`
        DROP TRIGGER check_quiz_type_expected_participants ON quiz;
    `)
};
