import { statsApi } from '../../../data/api.js';
import { newId, useEditor } from '../../hooks/useEditor.js';
import Page, { Panel } from '../../components/Page/Page.jsx';
import ListEditor from '../../components/ListEditor/ListEditor.jsx';
import { FieldRow, NumberField, SelectField, TextField } from '../../components/Field/Field.jsx';
import { listOnly } from '../shared.js';

const ICONS = [
  ['none', 'No icon'],
  ['devices', 'Devices'],
  ['ring', 'Progress ring'],
  ['swatches', 'Swatches'],
  ['network', 'Network'],
];

const PLACEMENTS = [
  ['strip', 'Strip under the hero', 'Four cards with animated icons.'],
  ['about', 'Notes in the About section', 'Pinned sticky notes (the design styles the first four).'],
];

const source = listOnly(statsApi);

export default function StatsPage() {
  const editor = useEditor(source.load, source.persist);

  return (
    <Page
      title="Stats"
      intro="A stat shows either a number that counts up (with an optional suffix like + or h) or a short word such as “Figma”."
      editor={editor}
    >
      {({ items }, change) =>
        PLACEMENTS.map(([placement, title, note]) => {
          const mine = items.filter((s) => s.placement === placement);
          // Keep the two groups contiguous: strip first, then about.
          const setMine = (next) =>
            change((draft) => ({
              items: PLACEMENTS.flatMap(([p]) =>
                p === placement ? next : draft.items.filter((s) => s.placement === p),
              ),
            }));
          return (
            <Panel title={title} note={note} key={placement}>
              <ListEditor
                items={mine}
                onChange={setMine}
                addLabel="Add stat"
                empty="No stats here yet."
                itemLabel={(s) => `${s.value_number ?? s.value_text ?? ''}${s.suffix || ''} ${s.label || ''}`.trim()}
                createItem={() => ({
                  id: newId(),
                  placement,
                  value_number: null,
                  value_text: '',
                  suffix: '',
                  label: 'New stat',
                  icon: 'none',
                })}
                renderItem={(stat, patch) => (
                  <>
                    <FieldRow>
                      <NumberField
                        label="Number (counts up)"
                        value={stat.value_number}
                        onChange={(value_number) => patch({ value_number })}
                        hint="Leave empty to show the word instead."
                      />
                      <TextField
                        label="Word (when there is no number)"
                        value={stat.value_text}
                        onChange={(value_text) => patch({ value_text })}
                      />
                      <TextField label="Suffix" value={stat.suffix} onChange={(suffix) => patch({ suffix })} />
                    </FieldRow>
                    <FieldRow>
                      <TextField label="Label" value={stat.label} onChange={(label) => patch({ label })} />
                      {placement === 'strip' && (
                        <SelectField label="Icon" value={stat.icon} options={ICONS} onChange={(icon) => patch({ icon })} />
                      )}
                    </FieldRow>
                  </>
                )}
              />
            </Panel>
          );
        })
      }
    </Page>
  );
}
