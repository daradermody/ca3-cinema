import { useCallback, useEffect, useState } from 'react'
import { GraphQLError } from 'graphql'
import { API, graphqlOperation } from 'aws-amplify'
import { GraphQLResult } from '@aws-amplify/api-graphql'

export default function useQuery<T = any>(query: string) {
  const [data, setData] = useState<T | undefined>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<GraphQLError | undefined>()

  const sendRequest = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    setData(undefined)
    try {
      const {data, errors} = await API.graphql(graphqlOperation(query)) as GraphQLResult<T>
      if (errors) {
        setError(errors[0])
      } else {
        setData(data)
      }
    } finally {
      setLoading(false)
    }
  }, [setData, setError, setLoading])

  useEffect(() => {
    void sendRequest()
  }, [sendRequest])

  return {data, loading, error, refetch: sendRequest}
}
