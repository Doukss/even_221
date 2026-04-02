const ClientService = require('../services/client.service');
const ApiResponse   = require('../utils/ApiResponse');
 
const ClientController = {
  async getAll(req, res, next) {
    try {
      const clients = await ClientService.getAll();
      ApiResponse.success(res, clients, 'Liste des clients récupérée.');
    } catch (err) { next(err); }
  },
 
  async getById(req, res, next) {
    try {
      const client = await ClientService.getById(Number(req.params.id));
      ApiResponse.success(res, client, 'Client récupéré.');
    } catch (err) { next(err); }
  },
 
  async create(req, res, next) {
    try {
      const client = await ClientService.create(req.body);
      ApiResponse.created(res, client, 'Client créé avec succès.');
    } catch (err) { next(err); }
  },
 
  async delete(req, res, next) {
    try {
      await ClientService.delete(Number(req.params.id));
      ApiResponse.success(res, null, 'Client supprimé avec succès.');
    } catch (err) { next(err); }
  },
};
 
module.exports = ClientController;