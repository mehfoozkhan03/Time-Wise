import "./pulseDot.css";

/**
 * PulseDot — animated ripple dot (like the Fourty60 "We Are Hiring" badge).
 *
 * Props:
 *  @param {string}  color   – dot + ripple color         (default: #22c55e)
 *  @param {string}  size    – dot diameter (CSS value)   (default: "10px")
 *  @param {string}  speed   – full cycle duration        (default: "1.8s")
 *  @param {string}  scale   – how far the ring expands   (default: "3.2")
 *  @param {string}  className – extra class on wrapper
 */
export function PulseDot({
  color = "#22c55e",
  size = "10px",
  speed = "2.5s",
  scale = "3.1",
  className = "",
}) {
  return (
    <span
      className={`pulse_dot_wrapper ${className}`.trim()}
      style={{
        "--pulse-dot-color": color,
        "--pulse-dot-size": size,
        "--pulse-dot-speed": speed,
        "--pulse-dot-scale": scale,
      }}
    >
      <span className="pulse_dot" />
    </span>
  );
}
