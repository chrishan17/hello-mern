const { isEmpty: isStringEmpty } = require('validator')
const { isEmpty } = require('lodash')

module.exports = (data) => {
  const errors = {}

  const {
    school = '', degree = '', fieldofstudy = '', from = '',
  } = data

  if (isStringEmpty(school)) {
    errors.school = 'School field is required'
  }

  if (isStringEmpty(degree)) {
    errors.degree = 'Degree field is required'
  }

  if (isStringEmpty(fieldofstudy)) {
    errors.fieldofstudy = 'Field of study field is required'
  }

  if (isStringEmpty(from)) {
    errors.from = 'From date field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
