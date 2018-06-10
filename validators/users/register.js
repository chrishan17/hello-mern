const {
  isEmail, isEmpty: isStringEmpty, isLength, equals, escape,
} = require('validator')
const { isEmpty, mapValues } = require('lodash')

module.exports = (data) => {
  const errors = {}

  const {
    name = '', email = '', password = '', password2 = '',
  } = mapValues(data, (value = '') =>
    value.trim())

  // validate name
  if (!isLength(name, { min: 4, max: 36 })) {
    errors.name = 'Name should be between 4 and 36 characters.'
  }
  if (isStringEmpty(name)) {
    errors.name = 'Name is required.'
  }

  // validate email
  if (!isEmail(email)) {
    errors.email = 'Email is invalid.'
  }
  if (isStringEmpty(email)) {
    errors.email = 'Email is required.'
  }

  // validate password
  if (!isLength(password, { min: 6, max: 36 })) {
    errors.password = 'Password should be between 6 and 36 characters.'
  }

  if (isStringEmpty(password)) {
    errors.password = 'Password is required.'
  }

  if (!equals(password, password2)) {
    errors.password2 = "Passwords doesn't match."
  }

  if (isStringEmpty(password2)) {
    errors.password2 = 'Confirm password is required'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
