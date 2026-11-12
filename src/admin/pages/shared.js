// Load/save helpers shared by the dashboard pages.
import { blankProfile, profileApi } from '../../data/api.js';
import { mapResult } from '../hooks/useEditor.js';

export const loadProfile = async () => mapResult(await profileApi.fetch(), (profile) => profile ?? blankProfile());

// For pages whose whole draft is `{ profile }`.
export const profileOnly = {
  load: async () => mapResult(await loadProfile(), (profile) => ({ profile })),
  persist: async (_saved, draft) => mapResult(await profileApi.update(draft.profile), (profile) => ({ profile })),
};

// For pages whose whole draft is `{ items }` backed by one list table.
export const listOnly = (api) => ({
  load: async () => mapResult(await api.fetch(), (items) => ({ items })),
  persist: async (saved, draft) => mapResult(await api.saveAll(saved.items, draft.items), (items) => ({ items })),
});

// change-helper: setter for one key of draft.profile
export const profileSetter = (change) => (key) => (value) =>
  change((draft) => ({ ...draft, profile: { ...draft.profile, [key]: value } }));
