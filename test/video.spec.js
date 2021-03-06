import test from 'ava'

import { mockPlay } from './common'
import { video } from '../lib/index'

test.serial('returns true for available video auto-playback', t => {
  mockPlay(() => Promise.resolve())
  return video().then(({result}) => t.true(result))
})

test.serial('returns false for unavailable video auto-playback', t => {
  mockPlay(() => Promise.reject(new Error()))
  return video().then(({result}) => t.false(result))
})

test.serial('returns true for old browsers', t => {
  mockPlay(() => undefined)
  return video().then(({result}) => t.true(result))
})

test.serial('reaches timeout with a false result', t => {
  t.plan(2)
  mockPlay(() => new Promise(resolve => undefined))
  return video({timeout: 0}).then(({result, error}) => {
    t.false(result)
    t.regex(error.message, /timeout/i)
  })
})

test.serial('returns error object', t => {
  const message = 'Aborted.'
  mockPlay(() => Promise.reject(new Error(message)))
  return video().then(({error}) => t.is(error.message, message))
})

test.serial('return null error by default', t => {
  mockPlay(() => Promise.resolve())
  return video().then(({error}) => t.is(error, null))
})
