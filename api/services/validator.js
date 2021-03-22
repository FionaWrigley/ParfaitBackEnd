//const { default: validator } = require('validator');
const { body, validationResult } = require('express-validator')
const winston = require('winston');

const loginValidationRules = () => {
  return [
    // username cannot be empty
    body('user.email', "Invalid username or password").notEmpty().bail().isEmail().bail().trim().escape().normalizeEmail(),
    // password cannot be empty
    body('user.password', 'Invalid username or password').notEmpty().bail().trim().escape(),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  loginValidationRules,
  validate,
}