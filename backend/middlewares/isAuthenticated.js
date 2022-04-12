/* eslint-disable linebreak-style */
const isAuthenticated = (req, res, next) => {
  if (req.session.username !== null && req.session.username !== '') {
    next()
  } else {
    res.send('you are not logged in')
    next(new Error('not logged in'))
  }
}

module.exports = isAuthenticated
