const Joi = require('joi');

/**
 * validate — Factory that returns an Express middleware using the given Joi schema.
 * Validates req.body and returns 400 with detailed errors on failure.
 * @param {Joi.Schema} schema
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ message: 'Validation error', errors });
  }
  next();
};

// ── Reusable Joi schemas ──────────────────────────────────────────────────────

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(64).required(),
  role: Joi.string().valid('student', 'faculty', 'admin').default('student'),
  enrollmentNo: Joi.string().when('role', { is: 'student', then: Joi.required() }),
  branch: Joi.string().required(),
  semester: Joi.number().integer().min(1).max(8).when('role', { is: 'student', then: Joi.required() }),
  phone: Joi.string().pattern(/^\d{10}$/).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  refreshSchema,
};
