const prisma = require('../config/database');
 
const ClientRepository = {
  async findAll() {
    return prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
  },
 
  async findById(id) {
    return prisma.client.findUnique({ where: { id } });
  },
 
  async findByEmail(email) {
    return prisma.client.findUnique({ where: { email } });
  },
 
  async create(data) {
    return prisma.client.create({ data });
  },
 
  async hasReservations(id) {
    const count = await prisma.reservation.count({ where: { clientId: id } });
    return count > 0;
  },
 
  async delete(id) {
    return prisma.client.delete({ where: { id } });
  },
};
 
module.exports = ClientRepository;