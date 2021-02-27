function validateEmail (email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}


function getHiddenAuthor (author) {
  const cutAuthor = author.replace(/@.*/, '')
  let starredAuthor = ''
  if (cutAuthor.length > 3) {
    starredAuthor = splitString(cutAuthor, '***', 3, cutAuthor.length)
  } else {
    starredAuthor = splitString(cutAuthor, '***', 0, cutAuthor.length)
  }
  return author.replace(/^.+@/, starredAuthor + '@')
}

function splitString (splitText, replaceText, splitAt, splitTill) {
  return splitText.substring(0, splitAt) + replaceText + splitText.substring(splitTill)
}

module.exports = { validateEmail, getHiddenAuthor }
