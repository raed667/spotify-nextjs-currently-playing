export const getHashParam = name => {
  const regex = new RegExp(`(#)(${name})(=)([^#]*)`)
  const matches = regex.exec(window.location.hash)

  if (matches !== null && matches.length > 4 && matches[4] !== null) {
    return matches[4]
  }
  return false
}
