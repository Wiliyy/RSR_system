import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../shared/lib/supabase'

const VOCABULARY_FIELDS = 'id,word,lang,translation,meaning,example,level,tags'
const VOCABULARY_LEVELS = new Set(['beginner', 'intermediate', 'advanced'])

function isNonBlankText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isVocabularyRow(row) {
  return row !== null
    && typeof row === 'object'
    && Number.isSafeInteger(row.id)
    && row.id > 0
    && isNonBlankText(row.word)
    && row.lang === 'en'
    && isNonBlankText(row.translation)
    && isNonBlankText(row.meaning)
    && isNonBlankText(row.example)
    && VOCABULARY_LEVELS.has(row.level)
    && Array.isArray(row.tags)
    && row.tags.length === 2
    && row.tags.every(isNonBlankText)
}

function isVocabularyQueryResult(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false
  if (!Object.hasOwn(value, 'data') || !Object.hasOwn(value, 'error')) return false
  if (value.error === null) return true

  return typeof value.error === 'object'
    && value.error !== null
    && !Array.isArray(value.error)
    && isNonBlankText(value.error.message)
}

export function useVocabulary(userKey) {
  const [result, setResult] = useState({
    vocabulary: [],
    error: null,
    loadedFor: null,
  })
  const [requestVersion, setRequestVersion] = useState(0)

  const retry = useCallback(() => {
    setResult((current) => ({ ...current, error: null, loadedFor: null }))
    setRequestVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    let active = true
    if (!userKey) return () => {
      active = false
    }

    supabase
      .from('vocabulary')
      .select(VOCABULARY_FIELDS)
      .order('id', { ascending: true })
      .then((queryResult) => {
        if (!active) return
        const succeeded = isVocabularyQueryResult(queryResult)
          && queryResult.error === null
          && Array.isArray(queryResult.data)
          && queryResult.data.every(isVocabularyRow)
          && new Set(queryResult.data.map((row) => row.id)).size === queryResult.data.length
        setResult({
          vocabulary: succeeded ? queryResult.data : [],
          error: succeeded ? null : 'load_failed',
          loadedFor: userKey,
        })
      })
      .catch(() => {
        if (!active) return
        setResult({ vocabulary: [], error: 'load_failed', loadedFor: userKey })
      })

    return () => {
      active = false
    }
  }, [userKey, requestVersion])

  const currentResult = result.loadedFor === userKey ? result : {
    vocabulary: [],
    error: null,
  }

  return {
    vocabulary: currentResult.vocabulary,
    loading: Boolean(userKey) && result.loadedFor !== userKey,
    error: currentResult.error,
    retry,
  }
}
