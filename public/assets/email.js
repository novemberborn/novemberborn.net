// Inspired by
// <http://pingturtle.com/home/post/cloudflare-email-protection-decoder>.
function decode(input) {
  const bytes = Uint8Array.from(input.match(/../g).map((byte) => Number.parseInt(byte, 16)))
  const key = bytes.at(0)
  const encoded = bytes.subarray(1)
  const decoded = encoded.map((byte) => byte ^ key)
  return new TextDecoder().decode(decoded)
}

function rewriteEmails() {
  for (const element of document.querySelectorAll('a[data-email]')) {
    element.href = 'mailto:' + decode(element.dataset.email)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', rewriteEmails)
} else {
  rewriteEmails()
}
