const prisma = require('../config/database');
 
const PrestataireRepository = {
  async findAll() {
    return prisma.prestataire.findMany({ orderBy: { createdAt: 'desc' } });
  },
 
  async findById(id) {
    return prisma.prestataire.findUnique({ where: { id } });
  },
 
  async findByEmail(email) {
    return prisma.prestataire.findUnique({ where: { email } });
  },
 
  async create(data) {
    return prisma.prestataire.create({ data });
  },

  async update(id, data) {
    return prisma.prestataire.update({ where: { id }, data });
  },
 
  async hasReservations(id) {
    const count = await prisma.reservation.count({ where: { prestataireId: id } });
    return count > 0;
  },
 
  async delete(id) {
    return prisma.prestataire.delete({ where: { id } });
  },
};
 
module.exports = PrestataireRepository;
