// -----------------------------------------------
// Role-Based Access Control (RBAC)
// Check if user has required role
// -----------------------------------------------

// Only principal can access
const isPrincipal = (req, res, next) => {
  if (req.user.role !== 'principal') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only principal can perform this action.',
    });
  }
  next();
};

// Only teacher can access
const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only teachers can perform this action.',
    });
  }
  next();
};

module.exports = { isPrincipal, isTeacher };
