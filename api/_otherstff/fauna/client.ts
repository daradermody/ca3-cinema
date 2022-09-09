import * as faunadb from 'faunadb'
import getToken from '../getToken'

export const fauna = new faunadb.Client({
  secret: getToken('FAUNADB_SECRET'),
  domain: 'db.eu.fauna.com',
  port: 443,
  scheme: 'https',
})
