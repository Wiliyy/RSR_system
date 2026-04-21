export function filterByFieldStartsWith(arr, field, prefix) {
  return arr.filter(item =>
    item[field]?.some(val => val.startsWith(prefix))
  )
}

export function filterByField(arr, field, value) {
  return arr.filter(item => item[field] === value)
}

export function filterByFieldIncludes(arr, field, value) {
  return arr.filter(item =>
    item[field]?.includes(value)
  )
}

