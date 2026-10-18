import { useState } from 'react'
import './SharePageUrl.css'

const SharePageUrl = ({ label = 'Share page', className = '' }) => {
  const [feedback, setFeedback] = useState('')

  const shareUrl = async () => {
    const url = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url,
        })
        setFeedback('Shared successfully')
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setFeedback('Link copied!')
      } else {
        // Fallback for browsers without Clipboard API access.
        const input = document.createElement('textarea')
        input.value = url
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()

        const copied = document.execCommand('copy')
        document.body.removeChild(input)

        setFeedback(copied ? 'Link copied!' : 'Could not copy link')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setFeedback('Could not share link')
      }
    }

    window.setTimeout(() => setFeedback(''), 2500)
  }

  return (
    <div className={`share-page-url ${className}`}>
      <button
        type="button"
        className="share-page-url__button"
        onClick={shareUrl}
        title="Share this page URL"
      >
        <span aria-hidden="true">↗</span>
        {label}
      </button>

      {feedback && (
        <span className="share-page-url__feedback" role="status">
          {feedback}
        </span>
      )}
    </div>
  )
}

export default SharePageUrl
