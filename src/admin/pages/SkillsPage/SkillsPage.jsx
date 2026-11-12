import { profileApi, skillLanesApi } from '../../../data/api.js';
import { newId, useEditor } from '../../hooks/useEditor.js';
import Page, { Panel } from '../../components/Page/Page.jsx';
import ListEditor from '../../components/ListEditor/ListEditor.jsx';
import ChipInput from '../../components/ChipInput/ChipInput.jsx';
import { FieldRow, TextField } from '../../components/Field/Field.jsx';
import { loadProfile, profileSetter } from '../shared.js';

async function load() {
  const [lanes, profile] = await Promise.all([skillLanesApi.fetch(), loadProfile()]);
  const failed = [lanes, profile].find((r) => r.error);
  return failed || { data: { lanes: lanes.data, profile: profile.data }, error: null };
}

async function persist(saved, draft) {
  const lanes = await skillLanesApi.saveAll(saved.lanes, draft.lanes);
  if (lanes.error) return lanes;
  const profile = await profileApi.update(draft.profile);
  if (profile.error) return profile;
  return { data: { lanes: lanes.data, profile: profile.data }, error: null };
}

export default function SkillsPage() {
  const editor = useEditor(load, persist);

  return (
    <Page title="Skills" intro="The three process lanes, plus soft skills and languages." editor={editor}>
      {({ lanes, profile }, change) => {
        const set = profileSetter(change);
        return (
          <>
            <Panel title="Lanes" note="The design is built for three lanes side by side.">
              <ListEditor
                items={lanes}
                onChange={(next) => change((draft) => ({ ...draft, lanes: next }))}
                addLabel="Add lane"
                empty="No lanes yet."
                itemLabel={(l) => l.title}
                createItem={() => ({
                  id: newId(),
                  number_label: String(lanes.length + 1).padStart(2, '0'),
                  title: 'New lane',
                  subtitle: '',
                  items: [],
                })}
                renderItem={(lane, patch) => (
                  <>
                    <FieldRow>
                      <TextField
                        label="Number"
                        value={lane.number_label}
                        onChange={(number_label) => patch({ number_label })}
                      />
                      <TextField label="Title" value={lane.title} onChange={(title) => patch({ title })} />
                      <TextField label="Subtitle" value={lane.subtitle} onChange={(subtitle) => patch({ subtitle })} />
                    </FieldRow>
                    <ChipInput label="Skills" values={lane.items} onChange={(items) => patch({ items })} />
                  </>
                )}
              />
            </Panel>
            <Panel title="Soft skills & languages">
              <ChipInput label="Soft skills" values={profile.soft_skills} onChange={set('soft_skills')} />
              <ChipInput label="Languages" values={profile.languages} onChange={set('languages')} />
            </Panel>
          </>
        );
      }}
    </Page>
  );
}
