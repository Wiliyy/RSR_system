import { getDueIndices } from './progress'
import { getItem, setItem } from './storage'

const SETTINGS_KEY = 'rsr_settings'
const DAILY_ACTIVITY_KEY = 'rsr_daily_activity'
const MIN_DAILY_LIMIT = 1
const MAX_DAILY_LIMIT = 100

export const DEFAULT_DAILY_LIMIT = 10

function normalizeLimit(value) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) return DEFAULT_DAILY_LIMIT
  return Math.min(MAX_DAILY_LIMIT, Math.max(MIN_DAILY_LIMIT, parsed))
}

function getLocalDateKey(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDailyLimit() {
  const settings = getItem(SETTINGS_KEY, {})
  return normalizeLimit(settings.dailyLimit ?? DEFAULT_DAILY_LIMIT)
}

export function saveDailyLimit(value) {
  const dailyLimit = normalizeLimit(value)
  setItem(SETTINGS_KEY, { dailyLimit })
  return dailyLimit
}

export function getTodayActivity(now = new Date()) {
  const date = getLocalDateKey(now)
  const activity = getItem(DAILY_ACTIVITY_KEY, null)

  if (activity?.date !== date || !Array.isArray(activity.itemIds)) {
    return { date, itemIds: [] }
  }

  return {
    date,
    itemIds: [...new Set(activity.itemIds)],
  }
}

export function recordDailyReview(itemId, now = new Date()) {
  const activity = getTodayActivity(now)

  if (!activity.itemIds.includes(itemId)) {
    activity.itemIds.push(itemId)
    setItem(DAILY_ACTIVITY_KEY, activity)
  }

  return activity
}

export function getDailyPlan(items, now = new Date(), limit = getDailyLimit()) {
  const safeItems = Array.isArray(items) ? items : []
  const dailyLimit = normalizeLimit(limit)
  const activity = getTodayActivity(now)
  const reviewedIds = new Set(activity.itemIds)
  const dueItems = getDueIndices(safeItems, new Date(now).getTime())
    .map((index) => safeItems[index])
    .filter((item) => !reviewedIds.has(item.id))
  const reviewedToday = activity.itemIds.length
  const remainingAllowance = Math.max(0, dailyLimit - reviewedToday)
  const selectedItems = dueItems.slice(0, remainingAllowance)

  return {
    items: selectedItems,
    limit: dailyLimit,
    reviewedToday,
    remainingAllowance,
    totalDue: dueItems.length,
    deferredCount: Math.max(0, dueItems.length - selectedItems.length),
    limitReached: reviewedToday >= dailyLimit,
    hasVocabulary: safeItems.length > 0,
  }
}
