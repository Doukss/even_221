const { body } = require('express-validator');
 
const TYPE_CLIENT = ['PARTICULIER', 'ENTREPRISE'];
 
const createClientRules = [
  body('prenom')
    .trim()
    .notEmpty().withMessage('Le prénom est obligatoire.'),
 
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire.'),
 
  body('email')
    .isEmail().withMessage("L'email doit être valide.")
    .normalizeEmail(),
 
  body('telephone')
    .trim()
    .notEmpty().withMessage('Le téléphone est obligatoire.'),
 
  body('type')
    .isIn(TYPE_CLIENT)
    .withMessage(`Le type doit être l'un des suivants : ${TYPE_CLIENT.join(', ')}.`),
];
 
module.exports = { createClientRules }