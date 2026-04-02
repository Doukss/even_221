const EspaceRepository = require('../repositories/espace.repository');
const ApiError = require('../utils/ApiError');
 
const EspaceService = {
  async getAll() {
    return EspaceRepository.findAll();
  },
 
  async getById(id) {
    const espace = await EspaceRepository.findById(id);
    if (!espace) throw ApiError.notFound('Espace');
    return espace;
  },
 
  async create(dto) {
    const existing = await EspaceRepository.findByCode(dto.code);
    if (existing) throw ApiError.conflict(`Un espace avec le code '${dto.code}' existe déjà.`);
 
    return EspaceRepository.create({
      code:        dto.code,
      nom:         dto.nom,
      capaciteMax: Number(dto.capaciteMax),
      type:        dto.type,
      prixParJour: Number(dto.prixParJour),
    });
  },
 
  async delete(id) {
    const espace = await EspaceRepository.findById(id);
    if (!espace) throw ApiError.notFound('Espace');
 
    const hasConfirmed = await EspaceRepository.hasConfirmedReservations(id);
    if (hasConfirmed) {
      throw ApiError.conflict(
        "Impossible de supprimer cet espace : il possède des réservations CONFIRMÉE en cours."
      );
    }
 
    return EspaceRepository.delete(id);
  },
};
 
module.exports = EspaceService;