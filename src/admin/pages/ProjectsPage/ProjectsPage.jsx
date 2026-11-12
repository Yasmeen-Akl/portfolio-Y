import { projectsApi } from '../../../data/api.js';
import { newId, useEditor } from '../../hooks/useEditor.js';
import Page, { Panel } from '../../components/Page/Page.jsx';
import ListEditor from '../../components/ListEditor/ListEditor.jsx';
import ImageField from '../../components/ImageField/ImageField.jsx';
import { FieldRow, TextField, Toggle } from '../../components/Field/Field.jsx';
import { listOnly } from '../shared.js';

const source = listOnly(projectsApi);

// Up to three screens; keeps positions while editing, drops trailing blanks.
const withScreen = (urls, index, url) => {
  const next = [0, 1, 2].map((i) => (i === index ? url : urls?.[i] || ''));
  while (next.length && !next[next.length - 1]) next.pop();
  return next;
};

export default function ProjectsPage() {
  const editor = useEditor(source.load, source.persist);

  return (
    <Page
      title="Projects"
      intro="Each project is a card with three phone mockups. Drafts stay hidden from the public site until published."
      editor={editor}
    >
      {({ items }, change) => (
        <Panel>
          <ListEditor
            items={items}
            onChange={(next) => change({ items: next })}
            addLabel="Add project"
            empty="No projects yet."
            itemLabel={(p) => p.title}
            itemBadge={(p) => !p.is_published && <span className="row-badge">Draft</span>}
            createItem={() => ({
              id: newId(),
              title: 'New project',
              tag: '',
              description: '',
              cover_url: '',
              screen_urls: [],
              case_study_url: '',
              is_published: false,
            })}
            renderItem={(project, patch) => (
              <>
                <Toggle
                  label="Published (visible on the site)"
                  checked={project.is_published}
                  onChange={(is_published) => patch({ is_published })}
                />
                <FieldRow>
                  <TextField label="Project name" value={project.title} onChange={(title) => patch({ title })} />
                  <TextField
                    label="Type"
                    placeholder="Mobile App · Healthcare"
                    value={project.tag}
                    onChange={(tag) => patch({ tag })}
                  />
                </FieldRow>
                <TextField
                  label="Short description"
                  multiline
                  value={project.description}
                  onChange={(description) => patch({ description })}
                />
                <TextField
                  label="Case study link"
                  type="url"
                  placeholder="https://…"
                  value={project.case_study_url}
                  onChange={(case_study_url) => patch({ case_study_url })}
                />
                <FieldRow>
                  {[0, 1, 2].map((i) => (
                    <ImageField
                      key={i}
                      tall
                      label={`Phone screen ${i + 1}`}
                      section="projects"
                      maxSide={1600}
                      value={project.screen_urls?.[i] || ''}
                      onChange={(url) => patch({ screen_urls: withScreen(project.screen_urls, i, url) })}
                    />
                  ))}
                </FieldRow>
              </>
            )}
          />
        </Panel>
      )}
    </Page>
  );
}
