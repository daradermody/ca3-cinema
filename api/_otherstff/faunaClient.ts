import * as faunadb from 'faunadb'
import getToken from './getToken'

export const q = faunadb.query
export const fauna = new faunadb.Client({
  secret: getToken('FAUNADB_SECRET'),
  domain: 'db.eu.fauna.com',
  port: 443,
  scheme: 'https',
})
export const SETTINGS_REF = q.Ref(q.Collection('Settings'), "338523062048653515")

export interface MapOf<T> {
  data: FaunaDoc<T>[]
}

export interface FaunaDoc<T> {
  ref: {
    value: {
      id: number
    }
  }
  data: T
}
