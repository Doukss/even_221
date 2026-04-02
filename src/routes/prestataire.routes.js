const router                    = require('express').Router();
const PrestataireController     = require('../controllers/prestataire.controller');
const { createPrestataireRules } = require('../validators/prestataire.validator');
const validate                  = require('../middlewares/validate');
 
router.get('/',       PrestataireController.getAll);
router.get('/:id',    PrestataireController.getById);
router.post('/',      createPrestataireRules, validate, PrestataireController.create);
router.delete('/:id', PrestataireController.delete);
 
module.exports = router;
