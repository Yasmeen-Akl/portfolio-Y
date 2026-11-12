import { cx } from '../../lib/cx.js';

// The demo banking screen inside the hero phone, drawn twice:
// once as a wireframe and once as the finished high-fidelity UI.

const I = ({ children }) => <svg viewBox="0 0 24 24">{children}</svg>;

const TRANSACTIONS = [
  {
    title: 'Groceries',
    when: 'Today, 10:24',
    amount: '−EGP 420',
    icon: (
      <I>
        <path d="M4 5h2l2 10h10l2-7H8" />
        <circle cx="10" cy="19" r="1" />
        <circle cx="17" cy="19" r="1" />
      </I>
    ),
  },
  {
    title: 'Salary',
    when: 'Yesterday',
    amount: '+EGP 9,500',
    positive: true,
    icon: (
      <I>
        <path d="M12 5v14M6 13l6 6 6-6" />
      </I>
    ),
  },
  {
    title: 'Transport',
    when: 'Mon, 8:10',
    amount: '−EGP 65',
    icon: (
      <I>
        <rect x="4" y="6" width="16" height="10" rx="3" />
        <path d="M7 19l1-3M17 19l-1-3" />
      </I>
    ),
  },
];

const ACTIONS = [
  ['Send', <path d="M5 12h14M13 6l6 6-6 6" />],
  ['Request', <path d="M19 12H5M11 6l-6 6 6 6" />],
  ['Top up', <path d="M12 5v14M5 12h14" />],
  [
    'More',
    <>
      <circle cx="6" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="18" cy="12" r="1" />
    </>,
  ],
];

const TABS = [
  <path d="M4 11l8-7 8 7v9H4z" />,
  <path d="M5 20V10M12 20V4M19 20v-7" />,
  <>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18" />
  </>,
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
  </>,
];

const Bar = ({ w }) => <i className="wf-bar" style={{ width: w }} />;

export function WireframeScreen() {
  return (
    <div className="screen-layer wireframe" id="wf">
      <div className="status-bar">
        <Bar w="26px" />
        <Bar w="40px" />
      </div>
      <div className="app-header">
        <span className="app-avatar" />
        <div className="app-header-text">
          <Bar w="60px" />
          <Bar w="90px" />
        </div>
        <span className="app-bell" />
      </div>
      <div className="balance-card">
        <span className="wf-note" style={{ top: '10px' }}>
          Hero card
        </span>
      </div>
      <div className="quick-actions" style={{ position: 'relative' }}>
        {ACTIONS.map(([label]) => (
          <div className="quick-action" key={label}>
            <span className="quick-action-icon" />
            <Bar w="30px" />
          </div>
        ))}
      </div>
      <div className="activity-head">
        <Bar w="96px" />
        <Bar w="36px" />
      </div>
      {TRANSACTIONS.map((t) => (
        <div className="activity-row" key={t.title}>
          <span className="activity-icon" />
          <div className="activity-meta">
            <Bar w="86px" />
            <Bar w="56px" />
          </div>
          <Bar w="46px" />
        </div>
      ))}
      <div className="tab-bar">
        {TABS.map((_, i) => (
          <i key={i} />
        ))}
      </div>
    </div>
  );
}

export function HiFiScreen() {
  return (
    <div className="screen-layer hifi" id="hf">
      <div className="status-bar">
        <span>9:41</span>
        <span>●●● ▮</span>
      </div>
      <div className="app-header">
        <span className="app-avatar">Y</span>
        <div className="app-header-text">
          <span>Welcome back</span>
          <b>Sara Hassan</b>
        </div>
        <span className="app-bell">
          <I>
            <path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z" />
            <path d="M10 21h4" />
          </I>
        </span>
      </div>
      <div className="balance-card">
        <small>Total balance</small>
        <strong>EGP 48,250</strong>
        <span className="balance-trend">+12.4% this month</span>
        <svg viewBox="0 0 240 46" preserveAspectRatio="none">
          <path d="M0 38C30 34 40 20 70 24S110 40 140 22 190 8 240 12" />
        </svg>
      </div>
      <div className="quick-actions">
        {ACTIONS.map(([label, icon]) => (
          <div className="quick-action" key={label}>
            <span className="quick-action-icon">
              <I>{icon}</I>
            </span>
            {label}
          </div>
        ))}
      </div>
      <div className="activity-head">
        <b>Recent activity</b>
        <span>See all</span>
      </div>
      {TRANSACTIONS.map((t) => (
        <div className="activity-row" key={t.title}>
          <span className="activity-icon">{t.icon}</span>
          <div className="activity-meta">
            {t.title}
            <small>{t.when}</small>
          </div>
          <b className={cx(t.positive && 'is-positive')}>{t.amount}</b>
        </div>
      ))}
      <div className="tab-bar">
        {TABS.map((icon, i) => (
          <span className={cx(i === 0 && 'is-active')} key={i}>
            <I>{icon}</I>
          </span>
        ))}
      </div>
    </div>
  );
}
