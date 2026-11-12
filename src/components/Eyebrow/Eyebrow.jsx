import './Eyebrow.css';

// Small uppercase label with the spinning sparkle. `.eyebrow` itself is a global style.
export default function Eyebrow({ children, style }) {
  return (
    <span className="eyebrow" style={style}>
      <svg className="eyebrow-spark" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
      </svg>
      {children}
    </span>
  );
}
