const { isEmpty: isStringEmpty, isLength, isURL } = require('validator')
const { isEmpty } = require('lodash')

module.exports = (data) => {
  const errors = {}

  const {
    handle = '', status = '', skills = '', website = '', social = {},
  } = data

  if (!isLength(handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to between 2 and 4 characters'
  }

  if (isStringEmpty(handle)) {
    errors.handle = 'Profile handle is required'
  }

  if (isStringEmpty(status)) {
    errors.status = 'Status field is required'
  }

  if (isStringEmpty(skills)) {
    errors.skills = 'Skills field is required'
  }

  if (!isStringEmpty(website)) {
    if (!isURL(website)) {
      errors.website = 'Not a valid URL'
    }
  }

  if (social.youtube && !isURL(social.youtube)) {
    errors.youtube = 'Not a valid URL'
  }

  if (social.twitter && !isURL(social.twitter)) {
    errors.twitter = 'Not a valid URL'
  }

  if (social.facebook && !isURL(social.facebook)) {
    errors.facebook = 'Not a valid URL'
  }

  if (social.linkedin && !isURL(social.linkedin)) {
    errors.linkedin = 'Not a valid URL'
  }

  if (social.instagram && !isURL(social.instagram)) {
    errors.instagram = 'Not a valid URL'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
