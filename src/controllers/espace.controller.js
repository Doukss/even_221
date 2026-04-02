const EspaceService = require('../services/espace.service');
const ApiResponse   = require('../utils/ApiResponse');
 
const EspaceController = {
  async getAll(req, res, next) {
    try {
      const espaces = await EspaceService.getAll();
      ApiResponse.success(res, espaces, 'Liste des espaces récupérée.');
    } catch (err) { next(err); }
  },
 
  async getById(req, res, next) {
    try {
      const espace = await EspaceService.getById(Number(req.params.id));
      ApiResponse.success(res, espace, 'Espace récupéré.');
    } catch (err) { next(err); }
  },
 
  async create(req, res, next) {
    try {
      const espace = await EspaceService.create(req.body);
      ApiResponse.created(res, espace, 'Espace créé avec succès.');
    } catch (err) { next(err); }
  },
 
  async delete(req, res, next) {
    try {
      await EspaceService.delete(Number(req.params.id));
      ApiResponse.success(res, null, 'Espace supprimé avec succès.');
    } catch (err) { next(err); }
  },
};
 
module.exports = EspaceController;