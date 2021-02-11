/*
 * Copyright (c) 2014-2021 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

const db = require('../data/mongodb')
const utils = require('../lib/utils')
const challenges = require('../data/datacache').challenges
const insecurity = require('../lib/insecurity')

module.exports = function productReviews () {
  return (req, res, next) => {
    const user = insecurity.authenticatedUsers.from(req)
    utils.solveIf(challenges.forgedReviewChallenge, () => { return user && user.data.email !== req.body.author })
    db.reviews.insert({
      product: req.params.id,
      message: req.body.message,
      author: getHiddenAuthor(req.body.author),
      likesCount: 0,
      likedBy: []
    }).then(result => {
      res.status(201).json({ staus: 'success' })
    }, err => {
      res.status(500).json(err)
    })
  }
}

function getHiddenAuthor (author) {
  const cutAuthor = author.replace(/@.*/, '')
  let starredAuthor = ''
  if (cutAuthor.length > 5) {
    starredAuthor = splitString(cutAuthor, '***', 3, cutAuthor.length)
  } else {
    starredAuthor = splitString(cutAuthor, '***', 0, cutAuthor.length)
  }
  return author.replace(/^.+@/, starredAuthor + '@')
}

function splitString (splitText, replaceText, splitAt, splitTill) {
  return splitText.substring(0, splitAt) + replaceText + splitText.substring(splitTill)
}
