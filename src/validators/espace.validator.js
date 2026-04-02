const { body } = require('express-validator');
 
const TYPE_ESPACE = ['SALLE_DE_CONFERENCE', 'JARDIN', 'ROOFTOP', 'SALLE_DE_FETE'];
 
const createEspaceRules = [
  body('code')
    .trim()
    .notEmpty().withMessage('Le code est obligatoire.'),
 
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire.'),
 
  body('capaciteMax')
    .isInt({ min: 1 }).withMessage('La capacité max doit être un entier > 0.'),
 
  body('type')
    .isIn(TYPE_ESPACE)
    .withMessage(`Le type doit être l'un des suivants : ${TYPE_ESPACE.join(', ')}.`),
 
  body('prixParJour')
    .isFloat({ min: 0.01 }).withMessage('Le prix par jour doit être > 0.'),
];
 
module.exports = { createEspaceRules };