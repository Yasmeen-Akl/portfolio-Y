// Email notification for contact-form messages, sent through Web3Forms.
// The access key is a public, form-scoped key (it only allows sending to its owner's inbox).
const key = import.meta.env.VITE_WEB3FORMS_KEY;

export const emailEnabled = Boolean(key);

// Resolves to { sent, error }. Never throws. Without a key it does nothing: { sent: false, error: null }.
export async function sendEmailNotification({ name, email, topic, body }) {
  if (!key) return { sent: false, error: null };
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `New portfolio message from ${name}`,
        from_name: 'Yasmeen Portfolio',
        name,
        email,
        replyto: email, // replying to the notification goes straight to the visitor
        topic,
        message: body,
        botcheck: false,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok && result.success) return { sent: true, error: null };
    return { sent: false, error: result.message || `HTTP ${response.status}` };
  } catch (e) {
    return { sent: false, error: e?.message || 'Network error' };
  }
}
