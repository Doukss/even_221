const ReservationRepository = require('../repositories/reservation.repository');
const ClientRepository      = require('../repositories/client.repository');
const EspaceRepository      = require('../repositories/espace.repository');
const PrestataireRepository = require('../repositories/prestataire.repository');
const ApiError              = require('../utils/ApiError');
 
const ReservationService = {
  async getAll() {
    return ReservationRepository.findAll();
  },
 
  async getById(id) {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) throw ApiError.notFound('Réservation');
    return reservation;
  },
 
  async create(dto) {
    // ── 1. Vérification de l'existence du client ────────────────────────────
    const client = await ClientRepository.findById(dto.clientId);
    if (!client) throw ApiError.notFound('Client');
 
    // ── 2. Vérification de l'existence de l'espace ─────────────────────────
    const espace = await EspaceRepository.findById(dto.espaceId);
    if (!espace) throw ApiError.notFound('Espace');
 
    // ── 3. Vérification du prestataire (optionnel) ──────────────────────────
    let prestataire = null;
    if (dto.prestataireId) {
      prestataire = await PrestataireRepository.findById(dto.prestataireId);
      if (!prestataire) throw ApiError.notFound('Prestataire');
    }
 
    // ── 4. dateEvenement ≥ aujourd'hui ──────────────────────────────────────
    const dateEvenement = new Date(dto.dateEvenement);
    dateEvenement.setHours(0, 0, 0, 0);
 
    const today = new Date();
    today.setHours(0, 0, 0, 0);
 
    if (dateEvenement < today) {
      throw ApiError.unprocessable(
        "La date de l'événement doit être égale ou postérieure à aujourd'hui."
      );
    }
 
    // ── 5. nombreInvites ≤ capaciteMax ──────────────────────────────────────
    if (dto.nombreInvites > espace.capaciteMax) {
      throw ApiError.unprocessable(
        `Le nombre d'invités (${dto.nombreInvites}) dépasse la capacité max de l'espace (${espace.capaciteMax}).`
      );
    }
 
    // ── 6. Disponibilité de l'espace à la date donnée ───────────────────────
    const estDisponible = await EspaceRepository.isAvailableOnDate(dto.espaceId, dateEvenement);
    if (!estDisponible) {
      throw ApiError.conflict(
        `L'espace '${espace.nom}' est déjà réservé (CONFIRMÉE) à la date du ${dateEvenement.toLocaleDateString('fr-FR')}.`
      );
    }
 
    // ── 7. Calcul du montant total ───────────────────────────────────────────
    //    montantTotal = prixParJour de l'espace + prix prestataire si applicable
    //    (Pour le livrable 1 : le prestataire n'a pas de prix propre → on ajoute 0)
    const montantTotal = Number(espace.prixParJour);
 
    // ── 8. Création de la réservation ────────────────────────────────────────
    return ReservationRepository.create({
      clientId:       dto.clientId,
      espaceId:       dto.espaceId,
      prestataireId:  dto.prestataireId ?? null,
      dateEvenement,
      nombreInvites:  dto.nombreInvites,
      montantTotal,
      statut:         'CONFIRMEE',
    });
  },
};
 
module.exports = ReservationService;