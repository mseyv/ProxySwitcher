import { getStorageData, setStorageData, saveProfile, deleteProfile } from '../utils/storage.js';
import { parseProxyHostString } from '../utils/proxy-manager.js';
import {
  resolveLanguage,
  applyI18n,
  t,
  getProfileDisplayName
} from '../utils/i18n.js';

let state = {
  profiles: [],
  activeProfileId: 'direct',
  autoSwitchRules: [],
  defaultAutoProfileId: 'direct',
  bypassList: [],
  language: 'auto'
};

let currentLang = 'en';

// Initialize Options Page
async function initOptions() {
  await loadState();
  setupNavigation();
  setupLanguageSelector();
  setupProfileModal();
  setupRuleModal();
  setupBypassTab();
  setupBackupTab();
}

async function loadState() {
  state = await getStorageData();
  currentLang = resolveLanguage(state.language || 'auto');
  applyI18n(currentLang);

  const langSelect = document.getElementById('select-language');
  if (langSelect) {
    langSelect.value = state.language || 'auto';
  }

  renderProfilesGrid();
  renderRulesTable();
  renderDefaultAutoProfileSelect();
  renderBypassTextarea();
}

/**
 * TAB NAVIGATION
 */
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));

      item.classList.add('active');
      const tabId = item.dataset.tab;
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });
}

/**
 * LANGUAGE SELECTOR
 */
function setupLanguageSelector() {
  const langSelect = document.getElementById('select-language');
  if (!langSelect) return;

  langSelect.addEventListener('change', async () => {
    const selected = langSelect.value;
    state.language = selected;
    await setStorageData({ language: selected });
    currentLang = resolveLanguage(selected);
    applyI18n(currentLang);
    renderProfilesGrid();
    renderRulesTable();
    renderDefaultAutoProfileSelect();
  });
}

/**
 * PROFILES MANAGEMENT
 */
function renderProfilesGrid() {
  const container = document.getElementById('profiles-grid');
  container.innerHTML = '';

  state.profiles.forEach(profile => {
    const card = document.createElement('div');
    card.className = 'profile-card';
    const color = profile.color || '#3b82f6';
    const displayName = getProfileDisplayName(profile, currentLang);

    let detailsHtml = '';
    if (profile.type === 'direct') {
      detailsHtml = `<div>${t('direct_desc', currentLang)}</div>`;
    } else if (profile.type === 'system') {
      detailsHtml = `<div>${t('system_desc', currentLang)}</div>`;
    } else if (profile.type === 'auto_switch') {
      detailsHtml = `<div>${t('auto_switch_desc', currentLang)}</div>`;
    } else if (profile.type === 'pac') {
      detailsHtml = `<div>PAC: ${escapeHtml(profile.pacUrl || t('pac_embedded', currentLang))}</div>`;
    } else if (profile.type === 'single') {
      detailsHtml = `
        <div><strong>${t('server_label', currentLang)}</strong> ${escapeHtml(profile.host)}:${profile.port}</div>
        <div><strong>${t('protocol_label', currentLang)}</strong> ${escapeHtml((profile.scheme || 'http').toUpperCase())}</div>
        ${profile.username ? `<div><strong>${t('auth_label', currentLang)}</strong> ${escapeHtml(profile.username)}</div>` : ''}
      `;
    }

    card.innerHTML = `
      <div class="profile-card-header">
        <div class="profile-title-box">
          <span class="color-dot" style="background-color: ${color}; color: ${color}; width: 12px; height: 12px; border-radius: 50%;"></span>
          <h3>${escapeHtml(displayName)}</h3>
        </div>
        <span class="badge">${escapeHtml(profile.type)}</span>
      </div>
      <div class="profile-card-body">
        ${detailsHtml}
      </div>
      <div class="profile-card-footer">
        ${profile.isSystem ? `<span class="help-text">${t('system_profile_badge', currentLang)}</span>` : `
          <button class="btn-icon btn-edit-profile" data-id="${profile.id}" title="${t('btn_edit', currentLang)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-icon danger btn-delete-profile" data-id="${profile.id}" title="${t('btn_delete', currentLang)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        `}
      </div>
    `;

    container.appendChild(card);
  });

  // Attach event listeners for edit and delete
  container.querySelectorAll('.btn-edit-profile').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const profile = state.profiles.find(p => p.id === id);
      if (profile) openProfileModal(profile);
    });
  });

  container.querySelectorAll('.btn-delete-profile').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm(t('confirm_delete_profile', currentLang))) {
        await deleteProfile(id);
        await reloadBackend();
        await loadState();
      }
    });
  });
}

function setupProfileModal() {
  const modal = document.getElementById('modal-profile');
  const btnAdd = document.getElementById('btn-add-profile');
  const form = document.getElementById('form-profile');
  const typeSelect = document.getElementById('profile-type');

  btnAdd.addEventListener('click', () => openProfileModal());

  typeSelect.addEventListener('change', () => {
    const isSingle = typeSelect.value === 'single';
    document.getElementById('section-single-proxy').classList.toggle('hidden', !isSingle);
    document.getElementById('section-pac-script').classList.toggle('hidden', isSingle);
  });

  document.querySelectorAll('[data-close="modal-profile"]').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('profile-id').value || 'profile_' + Date.now();
    const name = document.getElementById('profile-name').value;
    const type = document.getElementById('profile-type').value;
    const color = document.getElementById('profile-color').value;

    const newProfile = {
      id,
      name,
      type,
      color,
      isSystem: false
    };

    if (type === 'single') {
      const rawScheme = document.getElementById('profile-scheme').value;
      const rawHost = document.getElementById('profile-host').value;
      const rawPort = document.getElementById('profile-port').value;
      const rawUsername = document.getElementById('profile-username').value;
      const rawPassword = document.getElementById('profile-password').value;

      // Auto-sanitize host string (extract host, port, scheme, credentials if user pasted full URL)
      const parsed = parseProxyHostString(rawHost, rawPort, rawScheme);

      newProfile.scheme = parsed.scheme || rawScheme || 'http';
      newProfile.host = parsed.host || rawHost.trim();
      newProfile.port = parsed.port || parseInt(rawPort, 10) || 8080;
      newProfile.username = parsed.username || rawUsername.trim();
      newProfile.password = parsed.password || rawPassword.trim();
    } else if (type === 'pac') {
      newProfile.pacUrl = document.getElementById('profile-pac-url').value.trim();
      newProfile.pacData = document.getElementById('profile-pac-data').value;
    }

    await saveProfile(newProfile);
    await reloadBackend();
    modal.classList.remove('open');
    await loadState();
  });
}

function openProfileModal(profile = null) {
  const modal = document.getElementById('modal-profile');
  const title = document.getElementById('modal-profile-title');

  if (profile) {
    title.textContent = t('modal_edit_profile_title', currentLang);
    document.getElementById('profile-id').value = profile.id;
    document.getElementById('profile-name').value = profile.name;
    document.getElementById('profile-type').value = profile.type;
    document.getElementById('profile-color').value = profile.color || '#3b82f6';

    if (profile.type === 'single') {
      document.getElementById('profile-scheme').value = profile.scheme || 'http';
      document.getElementById('profile-host').value = profile.host || '';
      document.getElementById('profile-port').value = profile.port || 8080;
      document.getElementById('profile-username').value = profile.username || '';
      document.getElementById('profile-password').value = profile.password || '';
    } else if (profile.type === 'pac') {
      document.getElementById('profile-pac-url').value = profile.pacUrl || '';
      document.getElementById('profile-pac-data').value = profile.pacData || '';
    }
  } else {
    title.textContent = t('modal_create_profile_title', currentLang);
    document.getElementById('form-profile').reset();
    document.getElementById('profile-id').value = '';
    document.getElementById('profile-color').value = getRandomColor();
  }

  const isSingle = document.getElementById('profile-type').value === 'single';
  document.getElementById('section-single-proxy').classList.toggle('hidden', !isSingle);
  document.getElementById('section-pac-script').classList.toggle('hidden', isSingle);

  modal.classList.add('open');
}

/**
 * AUTO-SWITCH RULES
 */
function renderRulesTable() {
  const tbody = document.getElementById('rules-table-body');
  tbody.innerHTML = '';

  if (!state.autoSwitchRules || state.autoSwitchRules.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="help-text text-center">${t('rules_empty', currentLang)}</td></tr>`;
    return;
  }

  state.autoSwitchRules.forEach(rule => {
    const tr = document.createElement('tr');
    const targetProfile = state.profiles.find(p => p.id === rule.profileId);
    const profileName = targetProfile ? getProfileDisplayName(targetProfile, currentLang) : t('unknown_profile', currentLang);

    tr.innerHTML = `
      <td>
        <input type="checkbox" class="rule-toggle" data-id="${rule.id}" ${rule.enabled ? 'checked' : ''}>
      </td>
      <td><code>${escapeHtml(rule.pattern)}</code></td>
      <td><span class="badge" style="background:${targetProfile?.color || '#334155'}; color:#fff">${escapeHtml(profileName)}</span></td>
      <td class="text-right">
        <button class="btn-icon danger btn-delete-rule" data-id="${rule.id}" title="${t('btn_delete', currentLang)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.rule-toggle').forEach(chk => {
    chk.addEventListener('change', async (e) => {
      const id = e.target.dataset.id;
      const rule = state.autoSwitchRules.find(r => r.id === id);
      if (rule) {
        rule.enabled = e.target.checked;
        await setStorageData({ autoSwitchRules: state.autoSwitchRules });
        await reloadBackend();
      }
    });
  });

  tbody.querySelectorAll('.btn-delete-rule').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      state.autoSwitchRules = state.autoSwitchRules.filter(r => r.id !== id);
      await setStorageData({ autoSwitchRules: state.autoSwitchRules });
      await reloadBackend();
      renderRulesTable();
    });
  });
}

function renderDefaultAutoProfileSelect() {
  const select = document.getElementById('default-auto-profile');
  select.innerHTML = '';

  state.profiles.filter(p => p.type !== 'auto_switch').forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = getProfileDisplayName(p, currentLang);
    if (p.id === state.defaultAutoProfileId) opt.selected = true;
    select.appendChild(opt);
  });

  select.onchange = async () => {
    state.defaultAutoProfileId = select.value;
    await setStorageData({ defaultAutoProfileId: select.value });
    await reloadBackend();
  };
}

function setupRuleModal() {
  const modal = document.getElementById('modal-rule');
  const btnAdd = document.getElementById('btn-add-rule');
  const form = document.getElementById('form-rule');
  const profileSelect = document.getElementById('rule-profile');

  btnAdd.addEventListener('click', () => {
    profileSelect.innerHTML = '';
    state.profiles.filter(p => p.type !== 'auto_switch').forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = getProfileDisplayName(p, currentLang);
      profileSelect.appendChild(opt);
    });
    modal.classList.add('open');
  });

  document.querySelectorAll('[data-close="modal-rule"]').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pattern = document.getElementById('rule-pattern').value.trim();
    const profileId = profileSelect.value;

    const newRule = {
      id: 'rule_' + Date.now(),
      pattern,
      profileId,
      enabled: true
    };

    state.autoSwitchRules.push(newRule);
    await setStorageData({ autoSwitchRules: state.autoSwitchRules });
    await reloadBackend();
    modal.classList.remove('open');
    form.reset();
    renderRulesTable();
  });
}

/**
 * BYPASS LIST
 */
function renderBypassTextarea() {
  const textarea = document.getElementById('bypass-textarea');
  textarea.value = (state.bypassList || []).join('\n');
}

function setupBypassTab() {
  document.getElementById('btn-save-bypass').addEventListener('click', async () => {
    const text = document.getElementById('bypass-textarea').value;
    const list = text.split('\n').map(s => s.trim()).filter(Boolean);
    state.bypassList = list;
    await setStorageData({ bypassList: list });
    await reloadBackend();
    alert(t('bypass_saved_alert', currentLang));
  });
}

/**
 * BACKUP & IMPORT
 */
function setupBackupTab() {
  document.getElementById('btn-export-json').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `proxyswitcher-backup-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  const fileInput = document.getElementById('import-file-input');
  document.getElementById('btn-trigger-import').addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.profiles && Array.isArray(importedData.profiles)) {
          await setStorageData(importedData);
          await reloadBackend();
          await loadState();
          alert(t('import_success_alert', currentLang));
        } else {
          alert(t('import_invalid_format', currentLang));
        }
      } catch (err) {
        alert(t('import_error', currentLang) + err.message);
      }
    };
    reader.readAsText(file);
  });
}

async function reloadBackend() {
  await chrome.runtime.sendMessage({ type: 'RELOAD_SETTINGS' });
}

function getRandomColor() {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, match => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[match]));
}

document.addEventListener('DOMContentLoaded', initOptions);
