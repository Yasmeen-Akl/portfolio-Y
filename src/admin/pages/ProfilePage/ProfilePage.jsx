import { useEditor } from '../../hooks/useEditor.js';
import Page, { Panel } from '../../components/Page/Page.jsx';
import { FieldRow, TextField } from '../../components/Field/Field.jsx';
import ImageField from '../../components/ImageField/ImageField.jsx';
import { profileOnly, profileSetter } from '../shared.js';

export default function ProfilePage() {
  const editor = useEditor(profileOnly.load, profileOnly.persist);

  return (
    <Page title="Profile & Hero" intro="Your name and everything in the first screen of the site." editor={editor}>
      {({ profile }, change) => {
        const set = profileSetter(change);
        const headline = [0, 1, 2].map((i) => profile.hero_headline?.[i] ?? '');
        const setLine = (i) => (value) => set('hero_headline')(headline.map((line, k) => (k === i ? value : line)));
        return (
          <>
            <Panel title="Identity">
              <FieldRow>
                <TextField label="Full name" value={profile.full_name} onChange={set('full_name')} />
                <TextField
                  label="Kicker line (after your name)"
                  value={profile.kicker_line}
                  onChange={set('kicker_line')}
                />
              </FieldRow>
              <TextField
                label="Footer role line"
                value={profile.footer_role_line}
                onChange={set('footer_role_line')}
              />
            </Panel>

            <Panel title="Hero" note="The headline has three lines. The third is shown as the italic accent.">
              <FieldRow>
                <TextField label="Headline — line 1" value={headline[0]} onChange={setLine(0)} />
                <TextField label="Headline — line 2" value={headline[1]} onChange={setLine(1)} />
                <TextField label="Headline — line 3 (accent)" value={headline[2]} onChange={setLine(2)} />
              </FieldRow>
              <TextField label="Lead paragraph" multiline value={profile.hero_lead} onChange={set('hero_lead')} />
              <FieldRow>
                <TextField
                  label="Availability badge"
                  value={profile.availability_text}
                  onChange={set('availability_text')}
                />
                <TextField
                  label="CV link"
                  type="url"
                  placeholder="https://…"
                  value={profile.cv_url}
                  onChange={set('cv_url')}
                />
              </FieldRow>
              <ImageField
                label="Hero photo"
                section="hero"
                tall
                value={profile.hero_photo_url}
                onChange={set('hero_photo_url')}
              />
            </Panel>
          </>
        );
      }}
    </Page>
  );
}
