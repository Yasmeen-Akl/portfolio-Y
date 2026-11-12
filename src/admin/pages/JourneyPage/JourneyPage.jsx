import { journeyApi } from '../../../data/api.js';
import { newId, useEditor } from '../../hooks/useEditor.js';
import Page, { Panel } from '../../components/Page/Page.jsx';
import ListEditor from '../../components/ListEditor/ListEditor.jsx';
import ChipInput from '../../components/ChipInput/ChipInput.jsx';
import { FieldRow, TextField, Toggle } from '../../components/Field/Field.jsx';
import { listOnly } from '../shared.js';

const source = listOnly(journeyApi);

export default function JourneyPage() {
  const editor = useEditor(source.load, source.persist);

  return (
    <Page title="Journey" intro="The frames on the “Where I’ve Been” canvas, in the order they are connected." editor={editor}>
      {({ items }, change) => (
        <Panel>
          <ListEditor
            items={items}
            onChange={(next) => change({ items: next })}
            addLabel="Add frame"
            empty="No journey frames yet."
            itemLabel={(s) => s.title}
            itemBadge={(s) => s.is_current && <span className="row-badge">Now</span>}
            createItem={() => ({
              id: newId(),
              period: '',
              title: 'New step',
              organization: '',
              description: '',
              tags: [],
              is_current: false,
              sticker_text: '',
            })}
            renderItem={(step, patch) => (
              <>
                <FieldRow>
                  <TextField label="Period" value={step.period} onChange={(period) => patch({ period })} />
                  <TextField label="Title" value={step.title} onChange={(title) => patch({ title })} />
                </FieldRow>
                <TextField
                  label="Organization"
                  value={step.organization}
                  onChange={(organization) => patch({ organization })}
                />
                <TextField
                  label="Description"
                  multiline
                  value={step.description}
                  onChange={(description) => patch({ description })}
                />
                <ChipInput label="Tags" values={step.tags} onChange={(tags) => patch({ tags })} />
                <FieldRow>
                  <TextField
                    label="Sticker text (optional)"
                    value={step.sticker_text}
                    onChange={(sticker_text) => patch({ sticker_text })}
                    hint="Small tilted label on the card, e.g. 120 hours"
                  />
                  <Toggle
                    label="Current (shows the “Now” tag)"
                    checked={step.is_current}
                    onChange={(is_current) => patch({ is_current })}
                  />
                </FieldRow>
              </>
            )}
          />
        </Panel>
      )}
    </Page>
  );
}
