import { cx } from '../../lib/cx.js';
import { RevealContext, useReveal } from '../../hooks/useReveal.js';

// Scroll-reveal wrapper. Styles live in globals.css.
export default function Reveal({ as: Tag = 'div', className, children, ...rest }) {
  const [ref, shown] = useReveal();
  return (
    <Tag ref={ref} className={cx('reveal', className, shown && 'is-in')} {...rest}>
      <RevealContext.Provider value={shown}>{children}</RevealContext.Provider>
    </Tag>
  );
}
