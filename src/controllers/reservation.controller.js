const ReservationService = require('../services/reservation.service');
const ApiResponse        = require('../utils/ApiResponse');
 
const ReservationController = {
  async getAll(req, res, next) {
    try {
      const reservations = await ReservationService.getAll();
      ApiResponse.success(res, reservations, 'Liste des réservations récupérée.');
    } catch (err) { next(err); }
  },
 
  async getById(req, res, next) {
    try {
      const reservation = await ReservationService.getById(Number(req.params.id));
      ApiResponse.success(res, reservation, 'Réservation récupérée.');
    } catch (err) { next(err); }
  },
 
  async create(req, res, next) {
    try {
      const reservation = await ReservationService.create(req.body);
      ApiResponse.created(res, reservation, 'Réservation créée avec succès.');
    } catch (err) { next(err); }
  },
};
 
module.exports = ReservationController;