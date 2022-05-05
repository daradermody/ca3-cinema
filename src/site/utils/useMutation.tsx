import { useCallback, useState } from 'react'
import { GraphQLError } from 'graphql'
import { API, graphqlOperation } from 'aws-amplify'
import { GraphQLResult } from '@aws-amplify/api-graphql'

export default function useMutation<V = never>(mutation: string) {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<GraphQLError | undefined>()

  const sendRequest = useCallback(async (variables: V) => {
    setLoading(true)
    setError(undefined)
    try {
      const {errors} = await API.graphql(graphqlOperation(mutation, variables)) as GraphQLResult
      if (errors) {
        setError(errors[0])
      }
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading])

  return {mutation: sendRequest, loading, error, refetch: sendRequest}
}