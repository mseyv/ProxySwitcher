import { getStorageData, setStorageData } from '../utils/storage.js';
import { buildChromeProxyConfig, parseProxyHostString } from '../utils/proxy-manager.js';

/**
 * Update Chrome Extension Badge to reflect current proxy state
 */
async function updateBadge(profile) {
  if (!profile) return;

  let text = '';
  let color = profile.color || '#6b7280';

  switch (profile.type) {
    case 'direct':
      text = '';
      break;
    case 'system':
      text = 'SYS';
      color = '#6b7280';
      break;
    case 'auto_switch':
      text = 'AUTO';
      color = '#f59e0b';
      break;
    case 'pac':
      text = 'PAC';
      color = '#8b5cf6';
      break;
    case 'single':
      text = (profile.scheme || 'PROXY').toUpperCase();
      if (text === 'HTTPS') text = 'SEC';
      break;
    default:
      text = 'ON';
  }

  await chrome.action.setBadgeText({ text });
  if (text) {
    await chrome.action.setBadgeBackgroundColor({ color });
  }
}

/**
 * Apply proxy configuration to Chrome engine
 */
export async function applyCurrentProxyConfig() {
  try {
    const data = await getStorageData();
    const activeProfile = data.profiles.find(p => p.id === data.activeProfileId) || data.profiles[0];

    const proxyConfig = buildChromeProxyConfig(
      activeProfile,
      data.profiles,
      data.autoSwitchRules,
      data.defaultAutoProfileId,
      data.bypassList
    );

    await new Promise((resolve, reject) => {
      chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });

    await updateBadge(activeProfile);
    console.log('[ProxySwitcher] Applied proxy profile:', activeProfile.name, proxyConfig);
    return { success: true, activeProfile };
  } catch (error) {
    console.error('[ProxySwitcher] Error applying proxy settings:', error);
    return { success: false, error: error.message };
  }
}

// Proxy Authentication Listener (Correct asyncBlocking callback invocation)
chrome.webRequest.onAuthRequired.addListener(
  (details, callback) => {
    if (!details.isProxy) {
      callback({});
      return;
    }

    getStorageData().then(data => {
      const activeProfile = data.profiles.find(p => p.id === data.activeProfileId);

      // 1. Check active profile credentials
      if (activeProfile && activeProfile.username && activeProfile.password) {
        callback({
          authCredentials: {
            username: activeProfile.username,
            password: activeProfile.password
          }
        });
        return;
      }

      // 2. Match challenger host and port against saved profiles
      if (details.challenger) {
        const match = data.profiles.find(p => {
          if (!p.host) return false;
          const parsed = parseProxyHostString(p.host, p.port);
          return (parsed.host === details.challenger.host || p.host === details.challenger.host) &&
                 (parsed.port === details.challenger.port || parseInt(p.port, 10) === details.challenger.port);
        });

        if (match && match.username && match.password) {
          callback({
            authCredentials: {
              username: match.username,
              password: match.password
            }
          });
          return;
        }
      }

      // 3. Fallback to any profile with credentials
      const anyWithCreds = data.profiles.find(p => p.username && p.password);
      if (anyWithCreds) {
        callback({
          authCredentials: {
            username: anyWithCreds.username,
            password: anyWithCreds.password
          }
        });
        return;
      }

      callback({});
    }).catch(err => {
      console.error('[ProxySwitcher] Error in onAuthRequired:', err);
      callback({});
    });
  },
  { urls: ['<all_urls>'] },
  ['asyncBlocking']
);

// Service Worker Initialization & Lifecycle
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[ProxySwitcher] Installed / Updated');
  await applyCurrentProxyConfig();
});

chrome.runtime.onStartup.addListener(async () => {
  console.log('[ProxySwitcher] Browser Started');
  await applyCurrentProxyConfig();
});

// Runtime Message Handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.type === 'APPLY_PROFILE') {
        await setStorageData({ activeProfileId: message.profileId });
        const result = await applyCurrentProxyConfig();
        sendResponse(result);
      } else if (message.type === 'RELOAD_SETTINGS') {
        const result = await applyCurrentProxyConfig();
        sendResponse(result);
      } else if (message.type === 'ADD_QUICK_RULE') {
        const data = await getStorageData();
        const newRule = {
          id: 'rule_' + Date.now(),
          pattern: message.domain,
          profileId: message.targetProfileId,
          enabled: true
        };
        const updatedRules = [...data.autoSwitchRules, newRule];
        await setStorageData({
          autoSwitchRules: updatedRules,
          activeProfileId: 'auto_switch'
        });
        const result = await applyCurrentProxyConfig();
        sendResponse({ success: true, rule: newRule, ...result });
      } else if (message.type === 'GET_STATUS') {
        const data = await getStorageData();
        sendResponse({ success: true, data });
      } else {
        sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  })();
  return true;
});
