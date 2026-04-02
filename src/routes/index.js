const router = require('express').Router();
 
router.use('/espaces',       require('./espace.routes'));
router.use('/prestataires',  require('./prestataire.routes'));
router.use('/clients',       require('./client.routes'));
router.use('/reservations',  require('./reservation.routes'));
 
module.exports = router;