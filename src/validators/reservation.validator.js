const { body } = require('express-validator');
 
const createReservationRules = [
  body('clientId')
    .isInt({ min: 1 }).withMessage('clientId doit être un entier valide.'),
 
  body('espaceId')
    .isInt({ min: 1 }).withMessage('espaceId doit être un entier valide.'),
 
  body('prestataireId')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('prestataireId doit être un entier valide.'),
 
  body('dateEvenement')
    .isISO8601().withMessage("dateEvenement doit être une date valide (YYYY-MM-DD).")
    .toDate(),
 
  body('nombreInvites')
    .isInt({ min: 1 }).withMessage("nombreInvites doit être un entier > 0."),
];
 
module.exports = { createReservationRules };