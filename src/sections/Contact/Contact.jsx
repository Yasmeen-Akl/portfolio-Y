import { useEffect, useRef, useState } from 'react';
import { useContent } from '../../data/useContent.js';
import { isConnected, messagesApi, NOT_CONNECTED } from '../../data/api.js';
import { cx } from '../../lib/cx.js';
import { magnetic } from '../../lib/magnetic.js';
import { withAccent } from '../../lib/richText.jsx';
import Reveal from '../../components/Reveal/Reveal.jsx';
import Eyebrow from '../../components/Eyebrow/Eyebrow.jsx';
import './Contact.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY = { name: '', email: '', body: '' };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function validate({ name, email, body }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Please enter your name.';
  if (!EMAIL.test(email.trim())) errors.email = 'Please enter a valid email address.';
  if (!body.trim()) errors.body = 'Please write a short message.';
  return errors;
}

export default function Contact() {
  const { profile, contactTopics } = useContent();
  const [topic, setTopic] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [failure, setFailure] = useState('');
  const resetTimer = useRef();

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const field = (name) => ({
    value: form[name],
    onChange: (e) => {
      setForm((f) => ({ ...f, [name]: e.target.value }));
      if (errors[name]) setErrors(({ [name]: _, ...rest }) => rest);
    },
    'aria-invalid': errors[name] ? true : undefined,
  });

  const send = async () => {
    if (status !== 'idle') return;
    const found = validate(form);
    setErrors(found);
    setFailure('');
    if (Object.keys(found).length) return;
    if (!isConnected) {
      setFailure(`Couldn’t send your message — ${NOT_CONNECTED}.`);
      return;
    }

    // Same choreography as the original: the plane flies off, the label flips after 900ms.
    setStatus('sending');
    const [result] = await Promise.all([
      messagesApi.insert({
        name: form.name.trim(),
        email: form.email.trim(),
        topic: contactTopics[topic]?.label || '',
        body: form.body.trim(),
      }),
      wait(900),
    ]);
    if (result.error) {
      setStatus('idle');
      setFailure('Couldn’t send your message. Please try again in a moment.');
      return;
    }
    setStatus('sent');
    setForm(EMPTY);
    resetTimer.current = setTimeout(() => setStatus('idle'), 2500);
  };

  const problem = errors.name || errors.email || errors.body || failure;
  const links = [
    ['E-mail', profile.email && `mailto:${profile.email}`],
    ['Phone', profile.phone && `tel:${profile.phone.replace(/\s+/g, '')}`],
    ['LinkedIn', profile.linkedin_url],
    ['Behance', profile.behance_url],
  ];

  return (
    <section id="contact">
      <div className="wrap">
        <Reveal className="contact-card">
          <div>
            <Eyebrow>Let’s connect</Eyebrow>
            <h2>{withAccent(profile.contact_heading)}</h2>
            <div className="chat-bubble from-me" style={{ '--i': 0 }}>
              I have an idea for a product… 💡
            </div>
            <div className="chat-bubble from-you" style={{ '--i': 1 }}>
              I’d love to hear it. Tell me more and let’s design it together.
            </div>
            <div className="chat-bubble from-you" style={{ '--i': 2 }}>
              <span className="typing-dots">
                <span />
                <span />
                <span />
              </span>
            </div>
            <p style={{ margin: '18px 0 20px' }}>{profile.contact_text}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {links.map(([label, href]) => (
                <a
                  className="btn"
                  href={href || '#'}
                  {...(href && /^https?:/.test(href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                  {...magnetic}
                  key={label}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <form className="contact-form" noValidate onSubmit={(e) => e.preventDefault()}>
            <div className="topic-pills" role="radiogroup" aria-label="Topic">
              {contactTopics.map((t, i) => (
                <span
                  className={cx('topic-pill', i === topic && 'is-active')}
                  role="radio"
                  aria-checked={i === topic}
                  tabIndex={0}
                  onClick={() => setTopic(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setTopic(i);
                    }
                  }}
                  key={i}
                >
                  {t.label}
                </span>
              ))}
            </div>
            <input placeholder="Your Name" aria-label="Your name" autoComplete="name" maxLength={120} {...field('name')} />
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
              maxLength={254}
              {...field('email')}
            />
            <textarea
              rows="4"
              placeholder="Tell me about your project..."
              aria-label="Message"
              maxLength={5000}
              {...field('body')}
            />
            {problem && (
              <p className="form-error" role="alert">
                {problem}
              </p>
            )}
            <button
              className={cx('btn btn-primary', status !== 'idle' && 'is-sending')}
              type="button"
              id="send"
              onClick={send}
              {...magnetic}
            >
              <span className="send-label">{status === 'sent' ? 'Sent ✓' : 'Send Message'}</span>
              <svg className="send-plane" viewBox="0 0 24 24">
                <path d="M3 11l18-8-8 18-2-8z" />
              </svg>
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
