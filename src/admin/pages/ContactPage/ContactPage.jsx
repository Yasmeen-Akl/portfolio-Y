import { contactTopicsApi, profileApi } from '../../../data/api.js';
import { newId, useEditor } from '../../hooks/useEditor.js';
import Page, { Panel } from '../../components/Page/Page.jsx';
import ListEditor from '../../components/ListEditor/ListEditor.jsx';
import { FieldRow, TextField } from '../../components/Field/Field.jsx';
import { loadProfile, profileSetter } from '../shared.js';

async function load() {
  const [topics, profile] = await Promise.all([contactTopicsApi.fetch(), loadProfile()]);
  const failed = [topics, profile].find((r) => r.error);
  return failed || { data: { topics: topics.data, profile: profile.data }, error: null };
}

async function persist(saved, draft) {
  const topics = await contactTopicsApi.saveAll(saved.topics, draft.topics);
  if (topics.error) return topics;
  const profile = await profileApi.update(draft.profile);
  if (profile.error) return profile;
  return { data: { topics: topics.data, profile: profile.data }, error: null };
}

export default function ContactPage() {
  const editor = useEditor(load, persist);

  return (
    <Page title="Contact & Links" intro="The contact section, your links, and the topic pills of the form." editor={editor}>
      {({ topics, profile }, change) => {
        const set = profileSetter(change);
        return (
          <>
            <Panel title="Text">
              <TextField
                label="Heading"
                value={profile.contact_heading}
                onChange={set('contact_heading')}
                hint="Wrap the accent part in asterisks: Have an Idea? *Let’s Make It Happen.*"
              />
              <TextField label="Paragraph" multiline value={profile.contact_text} onChange={set('contact_text')} />
            </Panel>
            <Panel title="Links" note="These fill the E-mail, Phone, LinkedIn and Behance buttons.">
              <FieldRow>
                <TextField label="Email" type="email" value={profile.email} onChange={set('email')} />
                <TextField label="Phone" type="tel" value={profile.phone} onChange={set('phone')} />
              </FieldRow>
              <FieldRow>
                <TextField
                  label="LinkedIn URL"
                  type="url"
                  placeholder="https://…"
                  value={profile.linkedin_url}
                  onChange={set('linkedin_url')}
                />
                <TextField
                  label="Behance URL"
                  type="url"
                  placeholder="https://…"
                  value={profile.behance_url}
                  onChange={set('behance_url')}
                />
              </FieldRow>
            </Panel>
            <Panel title="Form topics" note="The first topic is selected by default.">
              <ListEditor
                items={topics}
                onChange={(next) => change((draft) => ({ ...draft, topics: next }))}
                addLabel="Add topic"
                empty="No topics yet."
                itemLabel={(t) => t.label}
                createItem={() => ({ id: newId(), label: 'New topic' })}
                renderItem={(topic, patch) => (
                  <TextField label="Topic label" value={topic.label} onChange={(label) => patch({ label })} />
                )}
              />
            </Panel>
          </>
        );
      }}
    </Page>
  );
}
