import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import { loadInterestFixtures, clearInterestFixtures, sessions } from './interestArchive.ability.fixture'
import { InterestStatus } from '../../interest/interest.constants'

test.before('setup database and app', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('populate database fixtures', async (t) => {
  t.context.fixtures = await loadInterestFixtures()
})

test.afterEach.always(async () => {
  await clearInterestFixtures()
})

const testScenarios = [
  {
    role: 'anon',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interestsArchived')
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'anon',
    action: 'read',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'anon',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interestsArchived')
        .send({
          person: context.fixtures.people[0]._id,
          opportunity: context.fixtures.archivedOpportunities[0]._id,
          comment: 'Test comment',
          status: InterestStatus.INTERESTED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'anon',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .send({
          comment: 'Updated test comment'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'anon',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server).delete(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'opportunity provider',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 2)
    }
  },
  {
    role: 'opportunity provider',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'opportunity provider',
    action: 'read (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'opportunity provider',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          opportunity: context.fixtures.archivedOpportunities[0]._id,
          comment: 'Test comment'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'opportunity provider',
    action: 'update (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          status: InterestStatus.ATTENDED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'opportunity provider',
    action: 'update (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          status: InterestStatus.NOTATTENDED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'opportunity provider',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'org admin',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 2)
    }
  },
  {
    role: 'org admin',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'org admin',
    action: 'read (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'org admin',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
        .send({
          opportunity: context.fixtures.archivedOpportunities[0]._id,
          comment: 'Test comment'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'org admin',
    action: 'update (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
        .send({
          status: InterestStatus.INVITED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'org admin',
    action: 'update (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
        .send({
          status: InterestStatus.INVITED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'org admin',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'admin',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 3)
    }
  },
  {
    role: 'admin',
    action: 'read',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'admin',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          person: context.fixtures.people[1]._id,
          opportunity: context.fixtures.archivedOpportunities[0]._id,
          comment: 'Test comment',
          status: InterestStatus.INVITED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'admin',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          status: InterestStatus.INVITED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'admin',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  }
]

for (const { role, action, makeRequest, assertions } of testScenarios) {
  test.serial(`Interest Archive API - ${role} - ${action}`, async t => {
    const response = await makeRequest(t.context)

    assertions(t, response)
  })
}
