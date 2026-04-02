class ApiError extends Error {
    constructor(statusCode, message, details = null ) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true; 
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, details = null) {
        return new ApiError(400, message, details);
    }

    static notFound(message, details = null) {
         return new ApiError(404, `${resource} introuvable.`);
    }

    static conflict(message) {
    return new ApiError(409, message);
    }

    static unprocessable(message, details = null) {
    return new ApiError(422, message, details);
    }

}

module.exports = ApiError;