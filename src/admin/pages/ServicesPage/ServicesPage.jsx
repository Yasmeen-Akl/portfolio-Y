import { serviceGroupsApi, servicesApi } from '../../../data/api.js';
import { newId, useEditor } from '../../hooks/useEditor.js';
import Page, { Panel } from '../../components/Page/Page.jsx';
import ListEditor from '../../components/ListEditor/ListEditor.jsx';
import { FieldRow, TextField } from '../../components/Field/Field.jsx';
import './ServicesPage.css';

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function load() {
  const [groups, services] = await Promise.all([serviceGroupsApi.fetch(), servicesApi.fetch()]);
  const failed = [groups, services].find((r) => r.error);
  return failed || { data: { groups: groups.data, services: services.data }, error: null };
}

async function persist(saved, draft) {
  // Every group needs a unique slug; fill in missing ones from the name.
  const used = new Set();
  const groups = draft.groups.map((g, i) => {
    let slug = slugify(g.slug) || slugify(g.name) || `group-${i + 1}`;
    while (used.has(slug)) slug += '-2';
    used.add(slug);
    return { ...g, slug };
  });
  // Groups first (services reference them); services are ordered group by group.
  const savedGroups = await serviceGroupsApi.saveAll(saved.groups, groups);
  if (savedGroups.error) return savedGroups;
  const ordered = groups.flatMap((g) => draft.services.filter((s) => s.group_id === g.id));
  const savedServices = await servicesApi.saveAll(saved.services, ordered);
  if (savedServices.error) return savedServices;
  return { data: { groups: savedGroups.data, services: savedServices.data }, error: null };
}

export default function ServicesPage() {
  const editor = useEditor(load, persist);

  return (
    <Page title="Services" intro="Services are grouped into the tabs shown on the site. Each group has its own list." editor={editor}>
      {({ groups, services }, change) => {
        const setGroups = (next) =>
          change((draft) => {
            const ids = new Set(next.map((g) => g.id));
            // Deleting a group removes its services too.
            return { groups: next, services: draft.services.filter((s) => ids.has(s.group_id)) };
          });
        const setServices = (groupId) => (next) =>
          change((draft) => ({
            ...draft,
            services: [...draft.services.filter((s) => s.group_id !== groupId), ...next],
          }));

        return (
          <Panel>
            <ListEditor
              items={groups}
              onChange={setGroups}
              addLabel="Add group"
              empty="No service groups yet."
              itemLabel={(g) => g.name}
              itemBadge={(g) => (
                <span className="row-badge">{services.filter((s) => s.group_id === g.id).length} services</span>
              )}
              createItem={() => ({ id: newId(), slug: '', name: 'New group', lead: '' })}
              renderItem={(group, patch) => (
                <>
                  <FieldRow>
                    <TextField label="Group name (tab label)" value={group.name} onChange={(name) => patch({ name })} />
                    <TextField
                      label="Slug"
                      value={group.slug}
                      onChange={(slug) => patch({ slug })}
                      hint="Short id, filled in automatically if left empty."
                    />
                  </FieldRow>
                  <TextField label="Lead sentence" value={group.lead} onChange={(lead) => patch({ lead })} />
                  <div className="nested-list">
                    <h3 className="nested-list-title">Services in this group</h3>
                    <ListEditor
                      items={services.filter((s) => s.group_id === group.id)}
                      onChange={setServices(group.id)}
                      addLabel="Add service"
                      empty="No services in this group yet."
                      itemLabel={(s) => s.name}
                      createItem={() => ({ id: newId(), group_id: group.id, name: 'New service', description: '' })}
                      renderItem={(service, patchService) => (
                        <FieldRow>
                          <TextField label="Service name" value={service.name} onChange={(name) => patchService({ name })} />
                          <TextField
                            label="Short description"
                            multiline
                            rows={2}
                            value={service.description}
                            onChange={(description) => patchService({ description })}
                          />
                        </FieldRow>
                      )}
                    />
                  </div>
                </>
              )}
            />
          </Panel>
        );
      }}
    </Page>
  );
}
