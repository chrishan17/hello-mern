const { isEmail, isEmpty: isStringEmpty } = require('validator')
const { isEmpty, mapValues } = require('lodash')

module.exports = (data) => {
  const errors = {}

  const { email = '', password = '' } = mapValues(data, (value = '') => value)
  if (!isEmail(email)) {
    errors.email = 'Email is invalid.'
  }

  if (isStringEmpty(email)) {
    errors.email = 'Email is required.'
  }

  if (isStringEmpty(password)) {
    errors.password = 'Password is required.'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
