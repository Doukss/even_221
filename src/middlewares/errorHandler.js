const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
 
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Erreurs métier intentionnelles
  if (err instanceof ApiError && err.isOperational) {
    return ApiResponse.error(res, err.statusCode, err.message, err.details);
  }
 
  // Erreurs Prisma — violations de contrainte unique
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] ?? 'champ';
    return ApiResponse.error(res, StatusCodes.CONFLICT, `La valeur du champ '${field}' existe déjà.`);
  }
 
  // Erreurs Prisma — enregistrement introuvable
  if (err.code === 'P2025') {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, err.meta?.cause ?? 'Enregistrement introuvable.');
  }
 
  // Erreur système non anticipée
  console.error('[ERREUR INTERNE]', err);
  return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Une erreur interne est survenue.');
};
 
module.exports = errorHandler;