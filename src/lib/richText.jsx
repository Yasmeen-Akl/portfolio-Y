// Tiny inline markup used by editable text fields.
//   ==text==  → <mark> (animated highlight)
//   *text*    → <em>   (italic serif accent)
function split(text, re, Tag) {
  return String(text ?? '')
    .split(re)
    .map((part, i) => (i % 2 ? <Tag key={i}>{part}</Tag> : part));
}

export const withMarks = (text) => split(text, /==(.+?)==/g, 'mark');
export const withAccent = (text) => split(text, /\*(.+?)\*/g, 'em');
