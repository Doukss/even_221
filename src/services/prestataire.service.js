const PrestataireRepository = require('../repositories/prestataire.repository');
const ApiError = require('../utils/ApiError');
 
const PrestataireService = {
  async getAll() {
    return PrestataireRepository.findAll();
  },
 
  async getById(id) {
    const prestataire = await PrestataireRepository.findById(id);
    if (!prestataire) throw ApiError.notFound('Prestataire');
    return prestataire;
  },
 
  async create(dto) {
    const existing = await PrestataireRepository.findByEmail(dto.email);
    if (existing) throw ApiError.conflict(`Un prestataire avec l'email '${dto.email}' existe déjà.`);
 
    return PrestataireRepository.create({
      nom:       dto.nom,
      type:      dto.type,
      email:     dto.email,
      telephone: dto.telephone,
    });
  },
 
  async delete(id) {
    const prestataire = await PrestataireRepository.findById(id);
    if (!prestataire) throw ApiError.notFound('Prestataire');
 
    const hasReservations = await PrestataireRepository.hasReservations(id);
    if (hasReservations) {
      throw ApiError.conflict(
        "Impossible de supprimer ce prestataire : il est lié à des réservations existantes."
      );
    }
 
    return PrestataireRepository.delete(id);
  },
};
 
module.exports = PrestataireService;
 