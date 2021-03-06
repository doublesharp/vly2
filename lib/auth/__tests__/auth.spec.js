import test from 'ava'
import jwtDecode from 'jwt-decode'
import people from '../../../server/api/person/__tests__/person.fixture'
import { jwtData, jwtDataBob, DEFAULT_SESSION } from '../../../server/middleware/session/__tests__/setSession.fixture'
import {
  setToken,
  unsetToken,
  getPersonFromUser,
  getSessionFromCookies,
  getSession
} from '../auth'
import Cookie from 'js-cookie'
import fetchMock from 'fetch-mock'
import sinon from 'sinon'

test.beforeEach(t => {
  // t.context.mockServer = fetchMock.sandbox()
  // global.fetch = t.context.mockServer
  t.context.cls = console.error
  console.error = sinon.spy()
})

test.afterEach(t => {
  fetchMock.reset()
  console.error = t.context.cls
})

test.serial('setToken writes cookies, unset clears', t => {
  setToken('idToken1234', 'accessToken5678')
  t.is(Cookie.get('idToken'), 'idToken1234')
  t.is(Cookie.get('accessToken'), 'accessToken5678')

  unsetToken()
  t.is(Cookie.get('idToken'), undefined)
})

test.serial('convert user to person when person exists', async t => {
  fetchMock.get('path:/api/people/', people[0])
  const user = jwtDecode(jwtData.idToken)
  const person = await getPersonFromUser(user)
  t.is(person.email, jwtData.idTokenPayload.email)
  fetchMock.restore()
})

test.serial('person look up fails', async t => {
  fetchMock.get('path:/api/people/', 404)
  const user = jwtDecode(jwtData.idToken)
  const person = await getPersonFromUser(user)
  t.false(person)
  fetchMock.restore()
})

test.serial('getSessionFromCookies', async t => {
  unsetToken()
  let session = await getSessionFromCookies()
  t.deepEqual(session, DEFAULT_SESSION)

  // bob has valid idToken but is email unverified, so should not be authenticated
  setToken(jwtDataBob.idToken, 'accessToken5678')
  session = await getSessionFromCookies()
  t.false(session.isAuthenticated)
  t.is(session.user.email, jwtDataBob.idTokenPayload.email)
  t.is(session.me.name, undefined)

  setToken(jwtData.idToken, 'accessToken5678')
  fetchMock.get('path:/api/people/', people[0])
  session = await getSessionFromCookies()
  t.is(session.me.email, jwtData.idTokenPayload.email)
  fetchMock.restore()
})

test.serial('getSession from req', async t => {
  const req = {
    session: {
      idToken: 'does not matter'
    }
  }
  const store = {
    dispatch: sinon.fake()
  }
  const session = await getSession(req, store)
  t.is(session, req.session)
  t.true(store.dispatch.calledOnce)
})

test.serial('getSession from cookies', async t => {
  const req = { }
  const store = {
    dispatch: sinon.fake()
  }
  setToken(jwtData.idToken, 'accessToken5678')
  fetchMock.get('path:/api/people/', people[0])
  const session = await getSession(req, store)
  t.is(session.me.email, jwtData.idTokenPayload.email)
  t.true(store.dispatch.calledOnce)

  fetchMock.restore()
})
