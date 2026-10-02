/**
 * ProxySwitcher i18n & Localization Module
 * Supports English ('en') and Russian ('ru').
 * Automatically detects system/browser language and defaults to 'en'
 * if the language is neither Russian nor English.
 */

export const TRANSLATIONS = {
  en: {
    // General
    app_name: 'ProxySwitcher Pro',
    control_panel: 'Control Panel',
    direct_name: 'Direct Connection',
    direct_desc: 'Direct internet access without proxy',
    system_name: 'System Proxy',
    system_desc: 'Use operating system proxy settings',
    auto_switch_name: 'Auto-Switch (Rules)',
    auto_switch_desc: 'Dynamic proxy routing based on domain rules',
    pac_name: 'PAC Script',
    pac_embedded: 'Embedded script',
    system_profile_badge: 'Built-in profile',
    unknown_profile: 'Unknown profile',
    server_label: 'Server:',
    protocol_label: 'Protocol:',
    auth_label: 'Auth:',

    // Popup
    current_site_label: 'Current site:',
    loading: 'Loading...',
    btn_add_rule: 'Add rule',
    btn_add_rule_added: 'Added!',
    section_profiles: 'Connection Profiles',
    footer_manage: 'Manage profiles and rules &rarr;',
    options_tooltip: 'Settings',
    local_tab: 'Local tab / System page',
    profile_detail_direct: 'No proxy',
    profile_detail_system: 'OS settings',
    profile_detail_auto_switch: 'Rule-based auto',
    profile_detail_pac: 'PAC Script',

    // Sidebar & Navigation
    nav_profiles: 'Proxy Profiles',
    nav_rules: 'Auto-Switch',
    nav_bypass: 'Bypass List',
    nav_backup: 'Import & Export',
    language_label: 'Language:',
    lang_auto: 'Auto (System / Browser)',
    lang_en: 'English',
    lang_ru: 'Русский',

    // Profiles Tab
    profiles_title: 'Connection Profiles',
    profiles_subtitle: 'Manage proxy servers, protocols, and credentials.',
    btn_add_profile: 'Add Profile',
    btn_edit: 'Edit',
    btn_delete: 'Delete',
    confirm_delete_profile: 'Are you sure you want to delete this profile?',

    // Rules Tab
    rules_title: 'Auto-Switch Rules',
    rules_subtitle: 'Automatic proxy routing based on domain or URL.',
    btn_add_rule_tab: 'Add Rule',
    default_auto_profile_label: 'Default profile (for all other websites):',
    th_status: 'Status',
    th_pattern: 'Domain / URL Pattern',
    th_profile: 'Target Profile',
    th_actions: 'Actions',
    rules_empty: 'No rules added yet',

    // Bypass Tab
    bypass_title: 'Bypass List',
    bypass_subtitle: 'Specify hosts and IP addresses that will be accessed directly bypassing any proxy.',
    bypass_label: 'Host list (one per line or comma-separated):',
    bypass_placeholder: '<local>\n127.0.0.1\nlocalhost\n*.internal.company.com',
    bypass_help: 'Example: <local>, 127.0.0.1, localhost, *.domain.com',
    btn_save_bypass: 'Save changes',
    bypass_saved_alert: 'Bypass list saved successfully!',

    // Backup Tab
    backup_title: 'Import & Export Settings',
    backup_subtitle: 'Save a backup copy of your profiles and rules or restore them.',
    export_card_title: 'Export Configuration',
    export_card_desc: 'Download complete configuration file in JSON format.',
    btn_export_json: 'Download JSON',
    import_card_title: 'Import Configuration',
    import_card_desc: 'Restore configuration from a JSON file.',
    btn_trigger_import: 'Load JSON',
    import_success_alert: 'Settings imported successfully!',
    import_invalid_format: 'Invalid backup file format.',
    import_error: 'Error reading JSON file: ',

    // Modal - Profile
    modal_create_profile_title: 'Create Profile',
    modal_edit_profile_title: 'Edit Profile',
    label_profile_name: 'Profile name:',
    placeholder_profile_name: 'e.g. Work Proxy / USA SOCKS5',
    label_profile_type: 'Connection type:',
    option_type_single: 'Proxy Server (HTTP / HTTPS / SOCKS)',
    option_type_pac: 'PAC Script',
    label_profile_color: 'Badge color:',
    label_protocol_field: 'Protocol:',
    label_host_field: 'Host / IP address:',
    placeholder_host: '192.168.1.100 or proxy.example.com',
    label_port_field: 'Port:',
    placeholder_port: '8080',
    label_username_field: 'Username (optional):',
    placeholder_username: 'Username',
    label_password_field: 'Password (optional):',
    placeholder_password: 'Password',
    chromium_auth_warning: '⚠️ <strong>Chromium Note:</strong> Chrome natively supports username/password only for HTTP/HTTPS proxies. If your SOCKS5 proxy requires authentication, choose HTTP (or run a local proxy bridge).',
    label_pac_url: 'PAC script URL:',
    placeholder_pac_url: 'https://example.com/proxy.pac',
    label_pac_data: 'Or PAC script code:',
    placeholder_pac_data: 'function FindProxyForURL(url, host) { return "DIRECT"; }',
    btn_cancel: 'Cancel',
    btn_save: 'Save',

    // Modal - Rule
    modal_add_rule_title: 'Add Auto-Switch Rule',
    label_rule_pattern: 'Domain or URL pattern (supports * and ?):',
    placeholder_rule_pattern: 'e.g. *.google.com, *.youtube.com or internal-site.local',
    help_rule_pattern: 'Wildcard *.google.com will route all subdomains of google.com',
    label_rule_profile: 'Target profile:',
    btn_save_rule: 'Save Rule'
  },
  ru: {
    // General
    app_name: 'ProxySwitcher Pro',
    control_panel: 'Панель управления',
    direct_name: 'Прямое подключение',
    direct_desc: 'Прямой доступ к интернету без прокси',
    system_name: 'Системный прокси',
    system_desc: 'Использование прокси-настроек операционной системы',
    auto_switch_name: 'Авто-переключение (Правила)',
    auto_switch_desc: 'Динамический выбор прокси на базе доменных правил',
    pac_name: 'PAC Скрипт',
    pac_embedded: 'Встроенный скрипт',
    system_profile_badge: 'Встроенный профиль',
    unknown_profile: 'Неизвестный профиль',
    server_label: 'Сервер:',
    protocol_label: 'Протокол:',
    auth_label: 'Авторизация:',

    // Popup
    current_site_label: 'Текущий сайт:',
    loading: 'Загрузка...',
    btn_add_rule: 'В правила',
    btn_add_rule_added: 'Добавлено!',
    section_profiles: 'Профили подключения',
    footer_manage: 'Управление профилями и правилами &rarr;',
    options_tooltip: 'Настройки',
    local_tab: 'Локальная вкладка / Служебная',
    profile_detail_direct: 'Без прокси',
    profile_detail_system: 'Настройки ОС',
    profile_detail_auto_switch: 'Авто по правилам',
    profile_detail_pac: 'PAC Скрипт',

    // Sidebar & Navigation
    nav_profiles: 'Профили прокси',
    nav_rules: 'Авто-переключение',
    nav_bypass: 'Исключения (Bypass)',
    nav_backup: 'Импорт и Экспорт',
    language_label: 'Язык интерфейса:',
    lang_auto: 'Авто (Система / Браузер)',
    lang_en: 'English',
    lang_ru: 'Русский',

    // Profiles Tab
    profiles_title: 'Профили подключений',
    profiles_subtitle: 'Управление серверами прокси, протоколами и учетными данными.',
    btn_add_profile: 'Добавить профиль',
    btn_edit: 'Редактировать',
    btn_delete: 'Удалить',
    confirm_delete_profile: 'Вы уверены, что хотите удалить этот профиль?',

    // Rules Tab
    rules_title: 'Правила авто-переключения',
    rules_subtitle: 'Автоматический выбор прокси в зависимости от домена или URL.',
    btn_add_rule_tab: 'Добавить правило',
    default_auto_profile_label: 'Профиль по умолчанию (для всех остальных сайтов):',
    th_status: 'Статус',
    th_pattern: 'Шаблон домена / URL',
    th_profile: 'Целевой Профиль',
    th_actions: 'Действия',
    rules_empty: 'Правила пока не добавлены',

    // Bypass Tab
    bypass_title: 'Список исключений (Bypass List)',
    bypass_subtitle: 'Укажите хосты и IP, к которым необходимо подключаться напрямую в обход прокси.',
    bypass_label: 'Список хостов (по одному на строку или через запятую):',
    bypass_placeholder: '<local>\n127.0.0.1\nlocalhost\n*.internal.company.com',
    bypass_help: 'Пример: <local>, 127.0.0.1, localhost, *.domain.com',
    btn_save_bypass: 'Сохранить изменения',
    bypass_saved_alert: 'Список исключений сохранён!',

    // Backup Tab
    backup_title: 'Импорт и экспорт настроек',
    backup_subtitle: 'Сохранение резервной копии профилей и правил или их восстановление.',
    export_card_title: 'Экспорт конфигурации',
    export_card_desc: 'Скачать полный файл настроек в формате JSON.',
    btn_export_json: 'Скачать JSON',
    import_card_title: 'Импорт конфигурации',
    import_card_desc: 'Восстановить настройки из файла JSON.',
    btn_trigger_import: 'Загрузить JSON',
    import_success_alert: 'Настройки успешно импортированы!',
    import_invalid_format: 'Некорректный формат файла резервной копии.',
    import_error: 'Ошибка при чтении файла JSON: ',

    // Modal - Profile
    modal_create_profile_title: 'Создать профиль',
    modal_edit_profile_title: 'Редактировать профиль',
    label_profile_name: 'Название профиля:',
    placeholder_profile_name: 'например: Work Proxy / USA SOCKS5',
    label_profile_type: 'Тип подключения:',
    option_type_single: 'Сервер прокси (HTTP / HTTPS / SOCKS)',
    option_type_pac: 'PAC Скрипт',
    label_profile_color: 'Цвет метки:',
    label_protocol_field: 'Протокол:',
    label_host_field: 'Хост / IP адрес:',
    placeholder_host: '192.168.1.100 или proxy.example.com',
    label_port_field: 'Порт:',
    placeholder_port: '8080',
    label_username_field: 'Логин (опционально):',
    placeholder_username: 'Username',
    label_password_field: 'Пароль (опционально):',
    placeholder_password: 'Password',
    chromium_auth_warning: '⚠️ <strong>Примечание Chromium:</strong> Браузер Chrome на сетевом уровне поддерживает логин/пароль только для HTTP/HTTPS прокси. Если у вас SOCKS5 с логином/паролем, выберите протокол HTTP (или запустите локальный прокси-мост).',
    label_pac_url: 'URL PAC скрипта:',
    placeholder_pac_url: 'https://example.com/proxy.pac',
    label_pac_data: 'Или текст PAC скрипта:',
    placeholder_pac_data: 'function FindProxyForURL(url, host) { return "DIRECT"; }',
    btn_cancel: 'Отмена',
    btn_save: 'Сохранить',

    // Modal - Rule
    modal_add_rule_title: 'Добавить правило авто-переключения',
    label_rule_pattern: 'Шаблон домена или URL (поддерживаются * и ?):',
    placeholder_rule_pattern: 'например: *.google.com, *.youtube.com или internal-site.ru',
    help_rule_pattern: 'Маска *.google.com перенаправит все поддомены google.com',
    label_rule_profile: 'Использовать профиль:',
    btn_save_rule: 'Сохранить правило'
  }
};

/**
 * Detect browser/system language:
 * - If Russian (starts with 'ru'), returns 'ru'.
 * - If English or ANY other language (neither Russian nor English), returns 'en'.
 */
export function detectBrowserLanguage() {
  let lang = 'en';
  try {
    if (typeof chrome !== 'undefined' && chrome?.i18n?.getUILanguage) {
      lang = chrome.i18n.getUILanguage();
    } else if (typeof navigator !== 'undefined') {
      lang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
    }
  } catch (e) {
    lang = 'en';
  }

  const clean = (lang || '').toLowerCase().trim();
  if (clean.startsWith('ru')) {
    return 'ru';
  }
  // Default to 'en' for English and any language other than Russian
  return 'en';
}

/**
 * Resolves effective language given user preference ('auto', 'ru', 'en')
 */
export function resolveLanguage(preference = 'auto') {
  if (preference === 'ru') return 'ru';
  if (preference === 'en') return 'en';
  return detectBrowserLanguage();
}

/**
 * Get translation string by key
 */
export function t(key, lang = 'en') {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (dict && dict[key] !== undefined) {
    return dict[key];
  }
  if (TRANSLATIONS.en && TRANSLATIONS.en[key] !== undefined) {
    return TRANSLATIONS.en[key];
  }
  return key;
}

/**
 * Localize DOM elements using data attributes:
 * - data-i18n="key"
 * - data-i18n-placeholder="key"
 * - data-i18n-title="key"
 */
export function applyI18n(lang = 'en') {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key, lang);
    if (val !== undefined) el.innerHTML = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key, lang);
    if (val !== undefined) el.placeholder = val;
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = t(key, lang);
    if (val !== undefined) el.title = val;
  });

  document.documentElement.lang = lang;
}

/**
 * Helper to get localized display name for a profile
 */
export function getProfileDisplayName(profile, lang = 'en') {
  if (!profile) return '';
  if (profile.id === 'direct' || profile.type === 'direct') return t('direct_name', lang);
  if (profile.id === 'system' || profile.type === 'system') return t('system_name', lang);
  if (profile.id === 'auto_switch' || profile.type === 'auto_switch') return t('auto_switch_name', lang);
  return profile.name;
}

/**
 * Helper to get localized detail text for popup item
 */
export function getProfileDetailText(profile, lang = 'en') {
  if (!profile) return '';
  if (profile.type === 'direct') return t('profile_detail_direct', lang);
  if (profile.type === 'system') return t('profile_detail_system', lang);
  if (profile.type === 'auto_switch') return t('profile_detail_auto_switch', lang);
  if (profile.type === 'pac') return t('profile_detail_pac', lang);
  if (profile.type === 'single') return `${profile.host}:${profile.port}`;
  return '';
}
