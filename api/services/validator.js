//const { default: validator } = require('validator');
const {
  param,
  body,
  validationResult
} = require('express-validator')

const loginValidationRules = () => {
  return [
    // username cannot be empty
    body('email', "Invalid username or password").notEmpty().bail().isEmail().bail().trim().escape().normalizeEmail(),
    // password cannot be empty
    body('password', 'Invalid username or password').notEmpty().bail().trim().escape(),
  ]
}

const profileValidationRules = () => {
  return [
    //fname must be alpha
    body('fname', "Invalid Name").isAlpha().bail().trim().escape(),
    //lname must be alpha
    body('lname', "Invalid Name").isAlpha().bail().trim().escape(),
    // username cannot be empty and must be a valid email
    body('email', "Invalid username or password").notEmpty().bail().isEmail().bail().trim().escape().normalizeEmail(),
    // phone must be a min of 10 digits
    body('phone', "Phone number should be 10 digits and contain only numbers").isLength({
      min: 10
    }).bail().isNumeric().bail().trim().escape()
  ]
}

const registerValidationRules = () => {
  return [
    //fname must be alpha
    body('user.fname', "Invalid Name").isAlpha().bail().trim().escape(),
    //lname must be alpha
    body('user.lname', "Invalid Name").isAlpha().bail().trim().escape(),
    // username cannot be empty and must be a valid email
    body('user.email', "Invalid username or password").notEmpty().bail().isEmail().bail().trim().escape().normalizeEmail(),
    // phone must be a min of 10 digits
    body('user.phone', "Phone number should be 10 digits and contain only numbers").isLength({
      min: 10
    }).bail().isNumeric().bail().trim().escape(),
    //Password should contain a minimum of 8 characters, including one upper case letter, one lower case letter, and one number
    body('user.password', "Password should contain a minimum of 8 characters, including one upper case lett" +
      "er, one lower case letter, and one number.").isStrongPassword().trim().escape(),
    body('user.userType', "Invalid user type").trim().escape(),
  ]
}

const scheduleDayValidationRules = () => {
  return [
    param('searchVal').trim().escape()
  ]
}

const groupSchedValidationRules = () => {
  return [
    param('groupID').isNumeric().bail().isLength({
      max: 10
    }).bail().trim().escape(),
    param('currDate').isSlug().bail().isLength(10).bail().trim().escape(),
    param('numberOfDays').isNumeric().bail().isLength({
      max: 3
    }).bail().trim().escape(),

  ]
}

const createGroupSanitize = () => {
  return [
    body('name', "Group name cannot be empty").notEmpty().trim().escape(),
    body('description').trim().escape(),
  ]
}

const sanitizeSearchVal = () => {
  return [
    //search string cannot be empty, or contain invalid chars
    param('searchVal').trim().escape(),
  ]
}

module.exports = {
  loginValidationRules,
  profileValidationRules,
  registerValidationRules,
  scheduleDayValidationRules,
  groupSchedValidationRules,
  createGroupSanitize,
  sanitizeSearchVal,
}