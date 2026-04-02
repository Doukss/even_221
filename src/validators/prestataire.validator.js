const { body } = require('express-validator');
 
const TYPE_PRESTATAIRE = ['TRAITEUR', 'DJ', 'PHOTOGRAPHE', 'DECORATEUR'];
 
const createPrestataireRules = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire.'),
 
  body('type')
    .isIn(TYPE_PRESTATAIRE)
    .withMessage(`Le type doit être l'un des suivants : ${TYPE_PRESTATAIRE.join(', ')}.`),
 
  body('email')
    .isEmail().withMessage("L'email doit être valide.")
    .normalizeEmail(),
 
  body('telephone')
    .trim()
    .notEmpty().withMessage('Le téléphone est obligatoire.'),
];
 
module.exports = { createPrestataireRules };