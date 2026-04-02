const ApiResponse = {
  success(res, data, message = "Succès", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  created(res, data, message = "Ressource créée avec succès") {
    return this.success(res, data, message, 201);
  },

  error(res, statusCode, message, details = null) {
    const payload = { success: false, message };
    if (details) payload.details = details;
    return res.status(statusCode).json(payload);
  },
};

module.exports = ApiResponse;