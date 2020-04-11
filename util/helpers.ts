import memoize from 'lodash.memoize'

export const hexToRgba = memoize((hex: string) => {
  if (!hex) return '#FFF'

  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgb(${r}, ${g}, ${b}, 0.2)`
})

export const idToColor = memoize((id) => {
  let hash = 0
  if (id.length === 0) return '#FFF'
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  const rgb = [0, 0, 0]
  for (let i = 0; i < 3; i++) {
    rgb[i] = (hash >> (i * 8)) & 255
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.2)`
})
