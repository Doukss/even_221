const router              = require('express').Router();
const EspaceController    = require('../controllers/espace.controller');
const { createEspaceRules } = require('../validators/espace.validator');
const validate            = require('../middlewares/validate');
 
router.get('/',      EspaceController.getAll);
router.get('/:id',   EspaceController.getById);
router.post('/',     createEspaceRules, validate, EspaceController.create);
router.delete('/:id', EspaceController.delete);
 
module.exports = router;