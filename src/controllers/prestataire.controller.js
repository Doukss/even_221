const PrestataireService = require('../services/prestataire.service');
const ApiResponse        = require('../utils/ApiResponse');
 
const PrestataireController = {
  async getAll(req, res, next) {
    try {
      const prestataires = await PrestataireService.getAll();
      ApiResponse.success(res, prestataires, 'Liste des prestataires récupérée.');
    } catch (err) { next(err); }
  },
 
  async getById(req, res, next) {
    try {
      const prestataire = await PrestataireService.getById(Number(req.params.id));
      ApiResponse.success(res, prestataire, 'Prestataire récupéré.');
    } catch (err) { next(err); }
  },
 
  async create(req, res, next) {
    try {
      const prestataire = await PrestataireService.create(req.body);
      ApiResponse.created(res, prestataire, 'Prestataire créé avec succès.');
    } catch (err) { next(err); }
  },
 
  async delete(req, res, next) {
    try {
      await PrestataireService.delete(Number(req.params.id));
      ApiResponse.success(res, null, 'Prestataire supprimé avec succès.');
    } catch (err) { next(err); }
  },
};
 
module.exports = PrestataireController;
