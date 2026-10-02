/**
 * ProxySwitcher Popup Interface Controller
 */

let currentDomainName = '';

async function initPopup() {
  const statusRes = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
  if (!statusRes || !statusRes.success) return;

  const { profiles, activeProfileId } = statusRes.data;

  renderProfiles(profiles, activeProfileId);
  setupQuickRuleSelector(profiles);
  await loadCurrentDomain();
  setupEventListeners();
}

function renderProfiles(profiles, activeProfileId) {
  const container = document.getElementById('profiles-list');
  container.innerHTML = '';

  profiles.forEach(profile => {
    const item = document.createElement('div');
    item.className = `profile-item ${profile.id === activeProfileId ? 'active' : ''}`;
    item.dataset.id = profile.id;

    let detailText = '';
    if (profile.type === 'direct') detailText = 'Без прокси';
    else if (profile.type === 'system') detailText = 'Настройки ОС';
    else if (profile.type === 'auto_switch') detailText = 'Авто по правилам';
    else if (profile.type === 'pac') detailText = 'PAC Скрипт';
    else if (profile.type === 'single') detailText = `${profile.host}:${profile.port}`;

    const color = profile.color || '#3b82f6';

    item.innerHTML = `
      <div class="profile-left">
        <span class="color-dot" style="background-color: ${color}; color: ${color};"></span>
        <div>
          <div class="profile-title">${escapeHtml(profile.name)}</div>
          <div class="profile-detail">${escapeHtml(detailText)}</div>
        </div>
      </div>
      <span class="profile-badge">${escapeHtml(profile.type)}</span>
    `;

    item.addEventListener('click', () => selectProfile(profile.id));
    container.appendChild(item);
  });
}

function setupQuickRuleSelector(profiles) {
  const select = document.getElementById('quick-target-profile');
  select.innerHTML = '';

  // Only show profiles capable of proxying
  const validProfiles = profiles.filter(p => p.type !== 'system' && p.type !== 'auto_switch');
  validProfiles.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    select.appendChild(opt);
  });
}

async function loadCurrentDomain() {
  const domainEl = document.getElementById('current-domain');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      if (url.protocol.startsWith('http')) {
        currentDomainName = url.hostname;
        domainEl.textContent = currentDomainName;
        return;
      }
    }
  } catch (e) {
    console.warn('Could not read current tab URL:', e);
  }
  domainEl.textContent = 'Локальная вкладка / Служебная';
  document.getElementById('btn-add-rule').disabled = true;
}

async function selectProfile(profileId) {
  // Update active class immediately for smooth feel
  document.querySelectorAll('.profile-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === profileId);
  });

  await chrome.runtime.sendMessage({
    type: 'APPLY_PROFILE',
    profileId
  });
}

async function addQuickRule() {
  if (!currentDomainName) return;

  const targetProfileId = document.getElementById('quick-target-profile').value;
  const res = await chrome.runtime.sendMessage({
    type: 'ADD_QUICK_RULE',
    domain: currentDomainName,
    targetProfileId
  });

  if (res && res.success) {
    const btn = document.getElementById('btn-add-rule');
    const origText = btn.innerHTML;
    btn.textContent = 'Добавлено!';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.innerHTML = origText;
      btn.style.background = '';
      initPopup(); // Refresh list
    }, 1200);
  }
}

function setupEventListeners() {
  document.getElementById('btn-options').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  document.getElementById('btn-manage-profiles').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  document.getElementById('btn-add-rule').addEventListener('click', addQuickRule);
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

document.addEventListener('DOMContentLoaded', initPopup);
