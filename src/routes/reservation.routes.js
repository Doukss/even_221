const router                       = require('express').Router();
const ReservationController        = require('../controllers/reservation.controller');
const { createReservationRules }   = require('../validators/reservation.validator');
const validate                     = require('../middlewares/validate');
 
router.get('/',     ReservationController.getAll);
router.get('/:id',  ReservationController.getById);
router.post('/',    createReservationRules, validate, ReservationController.create);
 
module.exports = router;