import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaLink, FaCopy, FaCheck } from 'react-icons/fa'
import './ShareableLink.css'

export default function ShareableLink({
  to,
  label = 'Share Link',
  showURL = true,
}) {
  const location = useLocation()
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const getShareUrl = () => {
    const origin = window.location.origin

    if (to) {
      if (/^https?:\/\//i.test(to)) return to
    }
    return new URL(to, origin).href
  }

  return new URL(
    `${location.pathname}${location.search}${location.hash}`,
    origin,
  ).href
}

const shareURL = getShareURL()

const handleCopy = async () => {
  setError('')

  try {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 2000)
  } catch {
    setError("Could'nt copy the lonk. Please copy it manually.")
  }
}

return (
  <div className="shareable-link">
    <div className="shareable-link_info">
      <FaLink className="shareable-link_icon" />

      <div className="shareable-link_text">
        <span className="shareable-link_label">{label}</span>

        {showURL && (
          <a className="shareable-link_url" href={shareUrl} title={shareURL}>
            {shareURL}
          </a>
        )}
      </div>
    </div>

    <button
      type="button"
      className={`shareable-link_button${copied ? 'is-copied' : ''}`}
      onClick={handleCopy}
      aria-label={copied ? 'Link copied' : 'Copy link'}
      title={copied ? 'Link copied' : 'Copy link'}
    >
      {copied ? <FaCheck /> : <FaCopy />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>

    {error && (
      <p className="shareable-link_error" role="alert">
        {error}
      </p>
    )}
  </div>
)
