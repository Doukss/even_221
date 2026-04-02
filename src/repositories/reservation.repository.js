const prisma = require('../config/database');
 
const INCLUDE_RELATIONS = {
  client: true,
  espace: true,
  prestataire: true,
};
 
const ReservationRepository = {
  async findAll() {
    return prisma.reservation.findMany({
      include: INCLUDE_RELATIONS,
      orderBy: { dateEvenement: 'asc' },
    });
  },
 
  async findById(id) {
    return prisma.reservation.findUnique({
      where: { id },
      include: INCLUDE_RELATIONS,
    });
  },
 
  async create(data) {
    return prisma.reservation.create({
      data,
      include: INCLUDE_RELATIONS,
    });
  },
};
 
module.exports = ReservationRepository;
