# ProxySwitcher Pro 🌐

> Powerful and elegant Google Chrome Extension (Manifest V3) for flexible proxy server management, one-click switching, and rule-based automatic routing.

[![Chrome Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](#-english) | [Русский](#-русский)

---

## 🇬🇧 English

### ✨ Key Features

- 🚀 **1-Click Switching**: Compact popup for quick profile toggling straight from the browser toolbar.
- 🔌 **Comprehensive Connection Types**:
  - **Direct Connection** — surf without any proxy.
  - **System Proxy** — inherit operating system proxy settings.
  - **Custom Proxy Servers** — `HTTP`, `HTTPS`, `SOCKS4`, and `SOCKS5`.
  - **PAC Scripts** — proxy auto-configuration via remote URL or custom `FindProxyForURL` script.
- 🔀 **Auto-Switch Rules**:
  - Route traffic through specific proxies depending on matched domains or URLs.
  - Wildcard pattern matching with `*` and `?` (e.g. `*.internal.net`, `*.google.com`, `*youtube*`).
  - 1-click button to add the current tab's domain to rules directly from popup.
  - Configurable fallback default profile for all unmatched domains.
- 🔑 **Proxy Authentication**:
  - Store username and password per profile.
  - Automated credential provisioning via Chrome `webRequestAuthProvider` API.
- 🛡️ **Bypass List**:
  - Specify hostnames and IP addresses to bypass proxies (supports `<local>`, `localhost`, `127.0.0.1`, CIDR/subnets).
- 🏷️ **Dynamic Badge Indicators**:
  - Visual status and color-coded badges on the toolbar icon (`SYS`, `AUTO`, `PAC`, `HTTP`, `SOCKS`, `SEC`) showing the active mode at a glance.
- 🌐 **Bilingual & Auto-Detection**: Full English and Russian support with automatic browser/system language detection (defaults to English if the environment language is neither Russian nor English).
- 💾 **Import & Export**:
  - Backup and restore all profiles and routing rules as a JSON file.
- ⚡ **Modern Architecture**:
  - Built from the ground up for **Manifest V3** with an event-driven background Service Worker.
  - Clean, responsive UI with modern typography and sleek dark/light aesthetics.

---

### 📁 Project Structure

```text
proxyswitcher/
├── _locales/                   # Internationalization strings (en, ru)
│   ├── en/messages.json
│   └── ru/messages.json
├── icons/                      # Extension icons (16x16, 48x48, 128x128)
├── scripts/
│   └── generate-icons.js       # Zero-dependency Node.js script generating PNG icons
├── src/
│   ├── background/
│   │   └── service-worker.js   # Background service worker: chrome.proxy and chrome.webRequest
│   ├── options/                # Options dashboard
│   │   ├── options.html
│   │   ├── options.css
│   │   └── options.js
│   ├── popup/                  # Quick-switch popup UI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── utils/
│       ├── i18n.js             # Internationalization helper & language detection
│       ├── proxy-manager.js    # PAC script generator & Chrome Proxy API converter
│       └── storage.js          # Helper for chrome.storage.local
├── manifest.json               # Manifest V3 extension configuration
├── package.json                # Project metadata & scripts
└── README.md
```

---

### 🛠️ Installation & Setup

Works on any Chromium-based browser (Google Chrome, Microsoft Edge, Brave, Opera, Vivaldi, etc.).

#### 1. Clone or Download Repository

```bash
git clone https://github.com/your-username/proxyswitcher.git
cd proxyswitcher
```

#### 2. Load into Browser

1. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the `proxyswitcher` folder.
5. The **ProxySwitcher Pro** icon will appear in your toolbar.

---

### 📖 Usage Guide

#### Quick Switching
1. Click the extension icon in your browser toolbar.
2. Click any profile to apply it immediately.

#### Adding Website Rules from Popup
1. Visit any website in your active tab (e.g. `example.com`).
2. Open the extension popup. The active domain will be detected automatically.
3. Choose the target proxy profile and click **"В правила"** (Add to rules).
4. The extension automatically adds the rule and activates **Auto-Switch** mode.

#### Managing Profiles & Settings
Click the gear icon in the popup or go to `chrome://extensions/` → Options:
- **Proxy Profiles**: Add or edit `HTTP`, `HTTPS`, `SOCKS5`, `SOCKS4`, or `PAC` servers with custom badge colors.
- **Auto-Switch Rules**: Manage domain routing patterns and set the default fallback profile.
- **Bypass List**: Manage hosts that bypass proxies.
- **Backup & Restore**: Export and import settings as `.json`.

> ℹ️ **Chromium Authentication Note**:  
> The Chromium browser engine natively supports proxy credentials (username/password) through the API for `HTTP` and `HTTPS` proxies. If you use a `SOCKS5` proxy requiring authentication, select HTTP mode (if supported by your proxy provider) or run a local proxy bridge.

---

### 🎨 Regenerating Icons

A built-in zero-dependency Node.js script generates crisp PNG icons using pure standard libraries:

```bash
npm run generate-icons
```

---

## 🇷🇺 Русский

### ✨ Основные возможности

- 🚀 **Переключение в 1 клик**: компактное всплывающее окно (Popup) для мгновенной смены профилей подключения прямо из панели инструментов браузера.
- 🔌 **Поддержка всех типов подключений**:
  - **Прямое подключение (Direct)** — работа без прокси.
  - **Системный прокси (System)** — использование настроек операционной системы.
  - **Прокси-серверы** — `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
  - **PAC-скрипты** — автоконфигурация прокси через внешний URL или пользовательский скрипт `FindProxyForURL`.
- 🔀 **Авто-переключение по правилам (Auto-Switch Rules)**:
  - Автоматический выбор нужного прокси в зависимости от открываемого домена или URL.
  - Поддержка масок с подстановочными знаками `*` и `?` (например, `*.internal.net`, `*.google.com`, `*youtube*`).
  - Быстрое добавление текущего открытого сайта в правила прямо из попапа.
  - Задание профиля по умолчанию для всех остальных сайтов.
- 🔑 **Аутентификация прокси**:
  - Сохранение логина и пароля в профиле.
  - Автоматическая передача учетных данных через API `webRequestAuthProvider`.
- 🛡️ **Список исключений (Bypass List)**:
  - Настройка хостов и диапазонов IP, которые должны открываться в обход прокси (поддержка `<local>`, `localhost`, `127.0.0.1`, корпоративных подсетей).
- 🏷️ **Информативный бейдж**:
  - Наглядные цветовые индикаторы и текстовые бейджи на иконке расширения (`SYS`, `AUTO`, `PAC`, `HTTP`, `SOCKS`, `SEC`), показывающие активный режим работы в реальном времени.
- 🌐 **Мультиязычность и автоопределение**: Полная поддержка английского и русского языков с автоматическим определением языка системы или браузера (по умолчанию используется английский, если язык не русский и не английский).
- 💾 **Импорт и Экспорт конфигурации**:
  - Сохранение резервной копии профилей и правил в файл JSON и быстрое восстановление на любом устройстве.
- ⚡ **Современная архитектура**:
  - Построено на стандарте **Manifest V3** с использованием фонового Service Worker без лишнего фонового потребления ресурсов.
  - Современный адаптивный UI с чистым дизайном.

---

### 📁 Структура проекта

```text
proxyswitcher/
├── _locales/                   # Файлы локализации Chrome (en, ru)
│   ├── en/messages.json
│   └── ru/messages.json
├── icons/                      # Иконки расширения (16x16, 48x48, 128x128)
├── scripts/
│   └── generate-icons.js       # Скрипт генерации PNG-иконок без сторонних зависимостей
├── src/
│   ├── background/
│   │   └── service-worker.js   # Фоновый сервис: управление chrome.proxy и chrome.webRequest
│   ├── options/                # Страница расширенных настроек
│   │   ├── options.html
│   │   ├── options.css
│   │   └── options.js
│   ├── popup/                  # Всплывающее окно быстрого переключения
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── utils/
│       ├── i18n.js             # Модуль локализации и автоопределения языка
│       ├── proxy-manager.js    # Генератор PAC-скриптов и конвертер настроек Chrome Proxy
│       └── storage.js          # Обертка над chrome.storage.local
├── manifest.json               # Манифест расширения Chrome (Manifest V3)
├── package.json                # Конфигурация проекта
└── README.md
```

---

### 🛠️ Установка и запуск

Расширение работает в любом браузере на базе Chromium (Google Chrome, Chromium, Brave, Microsoft Edge, Opera, Яндекс Браузер и др.).

#### 1. Загрузка исходного кода

Клонируйте репозиторий или скачайте архив с кодом:

```bash
git clone https://github.com/your-username/proxyswitcher.git
cd proxyswitcher
```

#### 2. Установка в браузер

1. Откройте браузер и перейдите на страницу расширений:
   - В Chrome: `chrome://extensions/`
   - В Edge: `edge://extensions/`
   - В Brave: `brave://extensions/`
2. В правом верхнем углу включите переключатель **«Режим разработчика»** (Developer mode).
3. Нажмите кнопку **«Загрузить распакованное расширение»** (Load unpacked).
4. Выберите папку проекта `proxyswitcher`.
5. Иконка **ProxySwitcher Pro** появится на панели инструментов браузера.

---

### 📖 Инструкция по использованию

#### Быстрое переключение
1. Нажмите на иконку расширения в панели браузера.
2. Кликните по любому настроенному профилю, чтобы немедленно переключить режим соединения.

#### Добавление правила для сайта прямо из всплывающего окна
1. Откройте любой сайт в текущей вкладке (например, `example.com`).
2. Откройте всплывающее окно расширения. Вверху отобразится текущий домен.
3. Выберите профиль, через который должен открываться этот сайт, и нажмите кнопку **«В правила»**.
4. Расширение автоматически добавит правило и переведет прокси в режим **«Авто-переключение (Правила)»**.

#### Управление профилями и правилами
Нажмите на иконку шестеренки в попапе или перейдите в параметры расширения через `chrome://extensions/` → «Параметры»:
- **Профили прокси**: добавление серверов `HTTP`, `HTTPS`, `SOCKS5`, `SOCKS4` или ссылок на `PAC`-файлы с возможностью выбора персонального цвета для бейджа.
- **Авто-переключение**: список правил маршрутизации и выбор профиля по умолчанию для остальных сайтов.
- **Исключения (Bypass)**: список адресов, которые всегда открываются напрямую.
- **Импорт и Экспорт**: скачивание и загрузка конфигурации в формате `.json`.

> ℹ️ **Особенности авторизации Chromium**:  
> Движок Chromium поддерживает авторизацию (логин/пароль) на уровне API только для `HTTP` и `HTTPS` прокси. Для авторизованных `SOCKS5` соединений рекомендуется использовать локальный мост или выбирать HTTP-протокол прокси-провайдера.

---

### 🎨 Перегенерация иконок

В проект встроен скрипт генерации PNG-иконок на чистом Node.js (без Canvas и сторонних библиотек):

```bash
npm run generate-icons
```

---

## 📄 License / Лицензия

[MIT License](LICENSE)
