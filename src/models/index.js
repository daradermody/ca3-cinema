// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Movie, MovieUser } = initSchema(schema);

export {
  User,
  Movie,
  MovieUser
};