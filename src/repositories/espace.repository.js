const prisma = require('../config/database');
 
const EspaceRepository = {
  async findAll() {
    return prisma.espace.findMany({ orderBy: { createdAt: 'desc' } });
  },
 
  async findById(id) {
    return prisma.espace.findUnique({ where: { id } });
  },
 
  async findByCode(code) {
    return prisma.espace.findUnique({ where: { code } });
  },
 
  async create(data) {
    return prisma.espace.create({ data });
  },

  async update(id, data) {
    return prisma.espace.update({ where: { id }, data });
  },
 
  async hasConfirmedReservations(id) {
    const count = await prisma.reservation.count({
      where: { espaceId: id, statut: 'CONFIRMEE' },
    });
    return count > 0;
  },
 
  async delete(id) {
    return prisma.espace.delete({ where: { id } });
  },
 
  async isAvailableOnDate(espaceId, dateEvenement, excludeReservationId = null) {
    const conflict = await prisma.reservation.findFirst({
      where: {
        espaceId,
        dateEvenement,
        statut: 'CONFIRMEE',
        ...(excludeReservationId && { id: { not: excludeReservationId } }),
      },
    });
    return conflict === null;
  },
};
 
module.exports = EspaceRepository;
