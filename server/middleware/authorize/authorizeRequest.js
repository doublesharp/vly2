const { Action } = require('../../services/abilities/ability.constants')

const defaultConvertRequestToAction = (req) => {
  switch (req.method) {
    case 'GET':
      return (req.route && req.route.path === '/') ? Action.LIST : Action.READ
    case 'POST':
      return Action.CREATE
    case 'PUT':
      return Action.UPDATE
    case 'DELETE':
      return Action.DELETE
    default:
      return Action.READ
  }
}

const authorizeActions = (subject, convertRequestToAction = defaultConvertRequestToAction) => (req, res, next) => {
  const action = convertRequestToAction(req)
  const authorized = req.ability.can(action, subject)
  // console.log('authorizeActions', subject, action, req.ability, authorized)
  if (authorized) {
    next()
  } else {
    res.status(403).end()
  }
}

module.exports = {
  authorizeActions,
  defaultConvertRequestToAction
}
