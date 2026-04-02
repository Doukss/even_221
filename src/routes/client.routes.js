const router                = require('express').Router();
const ClientController      = require('../controllers/client.controller');
const { createClientRules } = require('../validators/client.validator');
const validate              = require('../middlewares/validate');
 
router.get('/',       ClientController.getAll);
router.get('/:id',    ClientController.getById);
router.post('/',      createClientRules, validate, ClientController.create);
router.delete('/:id', ClientController.delete);
 
module.exports = router;