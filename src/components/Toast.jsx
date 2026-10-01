export default function Toast({ message, visible }) {
  return (
    <div className={`toast${visible ? ' visible' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  )
}
