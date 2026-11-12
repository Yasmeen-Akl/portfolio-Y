import { useContent } from '../../data/useContent.js';
import './Footer.css';

export default function Footer() {
  const { profile } = useContent();
  const firstName = (profile.full_name || '').split(' ')[0];

  return (
    <footer>
      <div className="footer-wordmark" aria-hidden="true">
        {firstName}
      </div>
      <b style={{ color: 'var(--ink)' }}>{profile.full_name}</b>
      <br />
      {profile.footer_role_line}
      <br />
      {`© ${new Date().getFullYear()} ${profile.full_name}. All Rights Reserved.`}
    </footer>
  );
}
