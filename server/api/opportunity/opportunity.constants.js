const { Action } = require('../../services/abilities/ability.constants')

const OpportunityRoutes = {
  [Action.LIST]: '/opportunities',
  [Action.READ]: '/opportunities/:id',
  [Action.UPDATE]: '/opportunities/:id/edit',
  [Action.CREATE]: '/opportunities/new'
}

const OpportunityStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

const OpportunityFields = {
  ID: '_id',
  NAME: 'name',
  SUBTITLE: 'subtitle',
  IMG_URL: 'imgUrl',
  DESCRIPTION: 'description',
  DURATION: 'duration',
  LOCATION: 'location',
  STATUS: 'status',
  DATE: 'date',
  OFFER_ORG: 'offerOrg',
  REQUESTOR: 'requestor',
  FROM_ACTIVITY: 'fromActivity',
  DATE_ADDED: 'dateAdded',
  TAGS: 'tags'
}

module.exports = {
  SchemaName: 'Opportunity',
  OpportunityStatus,
  OpportunityFields,
  OpportunityRoutes
}
