/**
 * ProxySwitcher Manager Utility
 * Converts extension profiles into chrome.proxy API configuration objects.
 */

export function parseProxyHostString(rawHost, rawPort = null, rawScheme = null) {
  if (!rawHost) return { host: '', port: rawPort || 8080, scheme: rawScheme || 'http', username: '', password: '' };

  let str = String(rawHost).trim();
  let scheme = rawScheme ? String(rawScheme).trim().toLowerCase() : null;
  let username = '';
  let password = '';
  let port = rawPort ? parseInt(rawPort, 10) : null;

  // Extract scheme if present e.g. socks5:// or http://
  if (str.includes('://')) {
    const parts = str.split('://');
    scheme = parts[0].toLowerCase();
    str = parts[1];
  }

  // Extract credentials if present e.g. user:pass@host
  if (str.includes('@')) {
    const parts = str.split('@');
    const creds = parts[0].split(':');
    username = decodeURIComponent(creds[0] || '');
    password = decodeURIComponent(creds[1] || '');
    str = parts[1];
  }

  // Strip path or query if present
  if (str.includes('/')) {
    str = str.split('/')[0];
  }
  if (str.includes('?')) {
    str = str.split('?')[0];
  }

  // Extract port if present e.g. host:port or [::1]:port
  if (str.includes(':')) {
    const lastColon = str.lastIndexOf(':');
    const possiblePort = parseInt(str.substring(lastColon + 1), 10);
    if (!isNaN(possiblePort)) {
      port = possiblePort;
      str = str.substring(0, lastColon);
    }
  }

  // Remove IPv6 brackets if left
  if (str.startsWith('[') && str.endsWith(']')) {
    str = str.substring(1, str.length - 1);
  }

  return {
    host: str,
    port: port || 8080,
    scheme: scheme || 'http',
    username,
    password
  };
}

export function profileToPacString(profile) {
  if (!profile || profile.type === 'direct' || profile.type === 'system') {
    return 'DIRECT';
  }

  if (profile.type === 'single') {
    const parsed = parseProxyHostString(profile.host, profile.port, profile.scheme);
    const host = parsed.host || '127.0.0.1';
    const port = parsed.port || 8080;
    const scheme = (parsed.scheme || profile.scheme || 'http').toLowerCase();

    if (scheme === 'socks5') {
      return `SOCKS5 ${host}:${port}; SOCKS ${host}:${port}; DIRECT`;
    } else if (scheme === 'socks4') {
      return `SOCKS ${host}:${port}; DIRECT`;
    } else if (scheme === 'https') {
      return `HTTPS ${host}:${port}; PROXY ${host}:${port}; DIRECT`;
    } else {
      return `PROXY ${host}:${port}; DIRECT`;
    }
  }

  return 'DIRECT';
}

export function generateAutoSwitchPac(rules, profiles, defaultProfileId, bypassList = []) {
  const defaultProfile = profiles.find(p => p.id === defaultProfileId);
  const defaultPac = profileToPacString(defaultProfile);

  let script = `
function FindProxyForURL(url, host) {
`;

  // Add bypass list check in PAC
  if (bypassList && bypassList.length > 0) {
    script += `  // Bypass rules\n`;
    for (const item of bypassList) {
      if (!item) continue;
      const cleanItem = item.trim();
      if (cleanItem === '<local>') {
        script += `  if (isPlainHostName(host) || shExpMatch(host, "127.0.0.1") || shExpMatch(host, "localhost")) return "DIRECT";\n`;
      } else {
        const pattern = cleanItem.includes('*') ? cleanItem : `*${cleanItem}*`;
        script += `  if (shExpMatch(host, "${pattern}")) return "DIRECT";\n`;
      }
    }
  }

  script += `\n  // Auto-switch matching rules\n`;

  // Sort rules (enabled first)
  const activeRules = (rules || []).filter(r => r.enabled && r.pattern && r.profileId);

  for (const rule of activeRules) {
    const targetProfile = profiles.find(p => p.id === rule.profileId);
    const targetPac = profileToPacString(targetProfile);
    let pattern = rule.pattern.trim();

    if (!pattern.includes('*') && !pattern.includes('?')) {
      if (pattern.startsWith('.')) {
        pattern = `*${pattern}`;
      } else {
        pattern = `*${pattern}*`;
      }
    }

    script += `  if (shExpMatch(host, "${pattern}") || shExpMatch(url, "${pattern}")) return "${targetPac}";\n`;
  }

  script += `\n  return "${defaultPac}";\n}\n`;
  return script;
}

export function buildChromeProxyConfig(profile, allProfiles = [], rules = [], defaultAutoProfileId = 'direct', bypassList = []) {
  if (!profile || profile.type === 'direct') {
    return { mode: 'direct' };
  }

  if (profile.type === 'system') {
    return { mode: 'system' };
  }

  if (profile.type === 'pac') {
    if (profile.pacUrl) {
      return {
        mode: 'pac_script',
        pacScript: {
          url: profile.pacUrl,
          mandatory: true
        }
      };
    } else if (profile.pacData) {
      return {
        mode: 'pac_script',
        pacScript: {
          data: profile.pacData,
          mandatory: true
        }
      };
    }
    return { mode: 'direct' };
  }

  if (profile.type === 'auto_switch') {
    const pacScriptData = generateAutoSwitchPac(rules, allProfiles, defaultAutoProfileId, bypassList);
    return {
      mode: 'pac_script',
      pacScript: {
        data: pacScriptData,
        mandatory: true
      }
    };
  }

  if (profile.type === 'single') {
    const parsed = parseProxyHostString(profile.host, profile.port, profile.scheme);
    const host = parsed.host || '127.0.0.1';
    const port = parsed.port || 8080;
    const scheme = (parsed.scheme || profile.scheme || 'http').toLowerCase();

    return {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: scheme,
          host: host,
          port: port
        },
        bypassList: bypassList && bypassList.length > 0 ? bypassList : ['<local>', '127.0.0.1', 'localhost']
      }
    };
  }

  return { mode: 'direct' };
}
