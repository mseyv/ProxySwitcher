/**
 * ProxySwitcher Storage Utility
 */

export const DEFAULT_PROFILES = [
  {
    id: 'direct',
    name: 'Прямое подключение',
    type: 'direct',
    color: '#10b981', // Emerald green
    isSystem: true
  },
  {
    id: 'system',
    name: 'Системный прокси',
    type: 'system',
    color: '#6b7280', // Slate gray
    isSystem: true
  },
  {
    id: 'auto_switch',
    name: 'Авто-переключение (Правила)',
    type: 'auto_switch',
    color: '#f59e0b', // Amber/Orange
    isSystem: true
  }
];

export const DEFAULT_BYPASS_LIST = [
  '<local>',
  '127.0.0.1',
  'localhost',
  '::1'
];

export const DEFAULT_STORAGE_DATA = {
  profiles: DEFAULT_PROFILES,
  activeProfileId: 'direct',
  autoSwitchRules: [],
  defaultAutoProfileId: 'direct',
  bypassList: DEFAULT_BYPASS_LIST,
  language: 'auto'
};

export async function getStorageData() {
  const result = await chrome.storage.local.get(null);
  return {
    profiles: result.profiles || DEFAULT_PROFILES,
    activeProfileId: result.activeProfileId || 'direct',
    autoSwitchRules: result.autoSwitchRules || [],
    defaultAutoProfileId: result.defaultAutoProfileId || 'direct',
    bypassList: result.bypassList || DEFAULT_BYPASS_LIST,
    language: result.language || 'auto'
  };
}

export async function setStorageData(data) {
  await chrome.storage.local.set(data);
}

export async function getActiveProfile() {
  const { profiles, activeProfileId } = await getStorageData();
  return profiles.find(p => p.id === activeProfileId) || profiles[0];
}

export async function saveProfile(profile) {
  const { profiles } = await getStorageData();
  const index = profiles.findIndex(p => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  await setStorageData({ profiles });
}

export async function deleteProfile(profileId) {
  const { profiles, activeProfileId, autoSwitchRules } = await getStorageData();
  const newProfiles = profiles.filter(p => p.id !== profileId && !p.isSystem);
  const updatedRules = autoSwitchRules.filter(r => r.profileId !== profileId);
  const newActiveId = activeProfileId === profileId ? 'direct' : activeProfileId;
  await setStorageData({
    profiles: newProfiles,
    activeProfileId: newActiveId,
    autoSwitchRules: updatedRules
  });
}
