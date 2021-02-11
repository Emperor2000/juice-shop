/*
 * Copyright (c) 2014-2021 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

/* jslint node: true */
const insecurity = require('../lib/insecurity')
const utils = require('../lib/utils')
const challenges = require('../data/datacache').challenges
const filelogger = require('../utillib/logger')
module.exports = (sequelize, { STRING, INTEGER }) => {
  const Feedback = sequelize.define('Feedback', {
    comment: {
      type: STRING,
      set (comment) {
        let sanitizedComment
        if (!utils.disableOnContainerEnv()) {
          sanitizedComment = insecurity.sanitizeHtml(comment)
          utils.solveIf(challenges.persistedXssFeedbackChallenge, () => { return utils.contains(sanitizedComment, '<iframe src="javascript:alert(`xss`)">') })
        } else {
          sanitizedComment = insecurity.sanitizeSecure(comment)
        }
        this.setDataValue('comment', sanitizedComment)
      }
    },
    rating: {
      type: INTEGER,
      allowNull: false,
      set (rating) {
        var datetime = new Date()
        if (rating <= 0) {
          rating = 1
          filelogger.logToFile('SEVERE : Attempt at data manipulation detected: ' + ' at date and time: ' + datetime + 'for property: rating, inserted < minimum of 1')
        }
        if (rating > 5) {
          filelogger.logToFile('SEVERE : Attempt at data manipulation detected: ' + ' at date and time: ' + datetime + 'for property: rating, inserted > maximum of  5')
          rating = 5
        }
        this.setDataValue('rating', rating)
        utils.solveIf(challenges.zeroStarsChallenge, () => { return rating === 0 })
      }
    }
  })

  Feedback.associate = ({ User }) => {
    Feedback.belongsTo(User) // no FK constraint to allow anonymous feedback posts
  }

  return Feedback
}
