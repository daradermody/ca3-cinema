import {
  And,
  Call,
  Collection,
  ContainsField,
  Create,
  Delete,
  Documents,
  ExprArg,
  Get,
  If,
  Index,
  IsArray,
  Map,
  Match,
  Merge,
  Not,
  Paginate,
  Ref,
  Select,
  Update
} from 'faunadb'
import Expr from 'faunadb/src/types/Expr'

export const Votes = 'Votes'
export const Movies = 'Movies'
export const Settings = 'Settings'
export const VoteEvents = 'Events'

const resolve = (doc: Expr, field: string) => {
  return If(
    ContainsField(field, doc),
    If(
      IsArray(getField(doc, field)),
      Map(
        getField(doc, field),
        ref => flatten(Get(ref))
      ),
      flatten(Get(getField(doc, field)))
    ),
    null
  )
}

const getField = (doc: Expr, field: string) => Select(field.split('.'), doc)

const flatten = (doc: Expr) => Call('flatten', doc)

export const ref = (collection: string, id: string) => Ref(Collection(collection), id)

export const collectionItems = (name: string) => Select(['data'], Map(Paginate(Documents(Collection(name))), obj => flatten(Get(obj))))

export const collectionRefs = (name: string) => Select(['data'], Paginate(Documents(Collection(name))))

export const createItem = (collection: string, data: ExprArg) => Create(Collection(collection), {data})

export const deleteItem = (collection: string, id: string) => Delete(ref(collection, id))

export const updateItem = (ref: Expr, data: ExprArg) => Update(ref, {data})

export const indexItems = (name: string, scope: ExprArg) => Select(['data'], Map(Paginate(Match(Index(name), scope)), obj => flatten(Get(obj))))

export const settingsRef = ref(Settings, process.env.SETTINGS_REF as string)

export const settings = flatten(Get(settingsRef))

export const activeVotingEventRef = Select(['votingEvent'], settings)

const votingEventActive = ContainsField('votingEvent', settings)

export const activeVotingEvent = If(votingEventActive, flatten(Get(activeVotingEventRef)), null)

export const resolvedActiveVotingEvent = If(
  votingEventActive,
  Merge(activeVotingEvent, {
    winner: resolve(activeVotingEvent, 'winner'),
    runoffOf: resolve(activeVotingEvent, 'runoffOf'),
    votingOptions: resolve(activeVotingEvent, 'votingOptions'),
  }),
  null
)

export const votesForActiveEvent = If(
  votingEventActive,
  Map(
    indexItems('votes_by_event', activeVotingEventRef),
    vote => Merge(
      vote,
      {
        movies: resolve(vote, 'movies')
      }
    )
  ),
  []
)

const resultIn = ContainsField('winner', activeVotingEventRef)

export const votingIsOpen = And(votingEventActive, Not(resultIn))

export const votingOptions = resolve(activeVotingEvent, 'votingOptions')
