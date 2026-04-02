const ClientRepository = require('../repositories/client.repository');
const ApiError = require('../utils/ApiError');
 
const ClientService = {
  async getAll() {
    return ClientRepository.findAll();
  },
 
  async getById(id) {
    const client = await ClientRepository.findById(id);
    if (!client) throw ApiError.notFound('Client');
    return client;
  },
 
  async create(dto) {
    const existing = await ClientRepository.findByEmail(dto.email);
    if (existing) throw ApiError.conflict(`Un client avec l'email '${dto.email}' existe déjà.`);
 
    return ClientRepository.create({
      prenom:    dto.prenom,
      nom:       dto.nom,
      email:     dto.email,
      telephone: dto.telephone,
      type:      dto.type,
    });
  },
 
  async delete(id) {
    const client = await ClientRepository.findById(id);
    if (!client) throw ApiError.notFound('Client');
 
    const hasReservations = await ClientRepository.hasReservations(id);
    if (hasReservations) {
      throw ApiError.conflict(
        "Impossible de supprimer ce client : il possède des réservations existantes."
      );
    }
 
    return ClientRepository.delete(id);
  },
};
 
module.exports = ClientService;