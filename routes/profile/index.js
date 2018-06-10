const express = require('express')
const passport = require('passport')
const { mapValues } = require('lodash')

const Profile = require('../../models/Profile')

// Load Validation
const profileInputValidator = require('../../validators/profile')
const experienceInputValidator = require('../../validators/profile/experience')
const educationInputValidator = require('../../validators/profile/education')

const router = express.Router()

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { user } = req
  const errors = {}
  Profile.findOne({ user: user.id }).then((profile) => {
    if (!profile) {
      errors.profile = 'There are no profiles.'
      return res.status(404).json(errors)
    }
    return res.status(200).json(profile)
  })
})

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {}

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        errors.profile = 'There are no profiles'
        return res.status(404).json(errors)
      }

      return res.json(profiles)
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }))
})

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
  const errors = {}

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.profile = 'There is no profile for this user'
        return res.status(404).json(errors)
      }

      return res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {}

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.profile = 'There is no profile for this user'
        return res.status(404).json(errors)
      }

      return res.json(profile)
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }))
})

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = profileInputValidator(req.body)

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }

  // Get fields
  const profileFields = mapValues(req.body, (value) => {
    if (typeof value === 'string') return value.trim()
    return value
  })
  profileFields.user = req.user.id
  // Skills - Spilt into array
  if (profileFields.skills !== '') {
    profileFields.skills = profileFields.skills.split(',')
  }

  return Profile.findOne({ user: profileFields.user }).then((profile) => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: profileFields.user },
        { $set: profileFields },
        { new: true },
      ).then(updatedProfile => res.json(updatedProfile))
    } else {
      // Create
      // Check if handle exists
      Profile.findOne({ handle: profileFields.handle }).then((oldProfile) => {
        if (oldProfile) {
          errors.handle = 'That handle already exists'
          res.status(400).json(errors)
        }

        // Save Profile
        new Profile(profileFields).save().then(newProfile => res.json(newProfile))
      })
    }
  })
})

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = experienceInputValidator(req.body)

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }

  return Profile.findOne({ user: req.user.id }).then((profile) => {
    const newExp = mapValues(req.body, (value) => {
      if (typeof value === 'string') return value.trim()
      return value
    })

    // Add to exp array
    profile.experience.unshift(newExp)

    profile.save().then(newProfile => res.json(newProfile))
  })
})

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = educationInputValidator(req.body)

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }

  return Profile.findOne({ user: req.user.id }).then((profile) => {
    const newEdu = mapValues(req.body, (value) => {
      if (typeof value === 'string') return value.trim()
      return value
    })

    // Add to exp array
    profile.education.unshift(newEdu)

    profile.save().then(newProfile => res.json(newProfile))
  })
})

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        // Splice out of array
        profile.experience.splice(removeIndex, 1)

        // Save
        profile.save().then(newProfile => res.json(newProfile))
      })
      .catch(err => res.status(404).json(err))
  },
)

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

        // Splice out of array
        profile.education.splice(removeIndex, 1)

        // Save
        profile.save().then(newProfile => res.json(newProfile))
      })
      .catch(err => res.status(404).json(err))
  },
)

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    res.json({ success: true })
  })
})
module.exports = router
