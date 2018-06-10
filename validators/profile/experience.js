const { isEmpty: isStringEmpty } = require('validator')
const { isEmpty } = require('lodash')

module.exports = (data) => {
  const errors = {}

  const {
    title = '', company = '', from = '', location = '',
  } = data

  if (isStringEmpty(title)) {
    errors.title = 'Job title field is required'
  }

  if (isStringEmpty(company)) {
    errors.company = 'Company field is required'
  }

  if (isStringEmpty(from)) {
    errors.from = 'From date field is required'
  }

  if (isStringEmpty(location)) {
    errors.location = 'Location data field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
