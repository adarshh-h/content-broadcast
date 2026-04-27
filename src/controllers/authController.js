const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// -----------------------------------------------
// POST /auth/register
// -----------------------------------------------
const register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { name, email, password, role } = req.body;
    const user = await authService.register({ name, email, password, role });

    return successResponse(res, 201, 'User registered successfully', user);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

// -----------------------------------------------
// POST /auth/login
// -----------------------------------------------
const login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { email, password } = req.body;
    const data = await authService.login({ email, password });

    return successResponse(res, 200, 'Login successful', data);
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
};

module.exports = { register, login };
