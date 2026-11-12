import { educationApi } from '../../../data/api.js';
import { newId, useEditor } from '../../hooks/useEditor.js';
import Page, { Panel } from '../../components/Page/Page.jsx';
import ListEditor from '../../components/ListEditor/ListEditor.jsx';
import { FieldRow, TextField, Toggle } from '../../components/Field/Field.jsx';
import { listOnly } from '../shared.js';

const source = listOnly(educationApi);

export default function EducationPage() {
  const editor = useEditor(source.load, source.persist);

  return (
    <Page
      title="Education"
      intro="Degrees and certificates. A featured entry is drawn as the big card; keep it first for the original layout."
      editor={editor}
    >
      {({ items }, change) => (
        <Panel>
          <ListEditor
            items={items}
            onChange={(next) => change({ items: next })}
            addLabel="Add entry"
            empty="No education entries yet."
            itemLabel={(e) => e.title}
            itemBadge={(e) => e.is_featured && <span className="row-badge">Featured</span>}
            createItem={() => ({
              id: newId(),
              badge: '',
              title: 'New entry',
              institution: '',
              details: '',
              status_label: 'Completed',
              is_current: false,
              is_featured: false,
            })}
            renderItem={(entry, patch) => (
              <>
                <FieldRow>
                  <TextField label="Badge (small label on top)" value={entry.badge} onChange={(badge) => patch({ badge })} />
                  <TextField label="Title" value={entry.title} onChange={(title) => patch({ title })} />
                </FieldRow>
                <FieldRow>
                  <TextField
                    label="Institution"
                    value={entry.institution}
                    onChange={(institution) => patch({ institution })}
                  />
                  <TextField label="Details" value={entry.details} onChange={(details) => patch({ details })} />
                </FieldRow>
                <FieldRow>
                  <TextField
                    label="Status label"
                    value={entry.status_label}
                    onChange={(status_label) => patch({ status_label })}
                    hint="e.g. Completed, Degree earned, Currently Enrolled"
                  />
                </FieldRow>
                <FieldRow>
                  <Toggle
                    label="Featured (big card)"
                    checked={entry.is_featured}
                    onChange={(is_featured) => patch({ is_featured })}
                  />
                  <Toggle
                    label="In progress (green live dot)"
                    checked={entry.is_current}
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
