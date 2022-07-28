import * as faunadb from 'faunadb'
import getToken from './getToken'

export const q = faunadb.query
export const fauna = new faunadb.Client({
  secret: getToken('FAUNADB_SECRET'),
  domain: 'db.eu.fauna.com',
  port: 443,
  scheme: 'https',
})

export type MapOf<T> = {
  data: {
    ref: {
      value: {
        id: number
      }
    }
    data: T
  }[]
}