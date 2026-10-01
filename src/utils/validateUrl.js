// Lightweight validation for the scan input. This does not perform any
// network request — it only checks that the text looks like a website
// address (e.g. "example.com", "http://example.com", "https://example.com").
const HOSTNAME_PATTERN =
  /^(https?:\/\/)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(:\d{1,5})?(\/.*)?$/i

export function isValidWebsiteUrl(input) {
  if (!input) return false
  const value = input.trim()
  if (!value) return false
  return HOSTNAME_PATTERN.test(value)
}

export function validateScanInput(input) {
  if (!input || !input.trim()) {
    return 'Please enter a valid website URL.'
  }
  if (!isValidWebsiteUrl(input)) {
    return 'Please enter a valid website URL.'
  }
  return null
}
