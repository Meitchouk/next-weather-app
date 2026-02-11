# 🌤️ Weather App — Aplicación de Clima

Aplicación web para consultar el clima actual de cualquier ciudad del mundo. Construida con **Next.js 16**, **TypeScript**, **MUI 7** y la API de **OpenWeatherMap**.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura y Patrones de Diseño](#-arquitectura-y-patrones-de-diseño)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Tests](#-tests)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Decisiones Arquitectónicas (ADR)](#-decisiones-arquitectónicas-adr)

---

## ✨ Características

- 🔍 Búsqueda del clima actual por nombre de ciudad
- 🌡️ Muestra temperatura (°C / °F), humedad (%) y descripción del clima
- 🌐 **Internacionalización (i18n)** — Español e Inglés con `next-intl`
- 🌗 **Modo claro / oscuro** — Sincronizado MUI + next-themes
- 🎨 **Design System** — MUI 7 (Material UI) como librería de componentes
- ⚛️ **Atomic Design** — Atoms → Molecules → Organisms → Templates
- 🕐 **Historial de búsquedas** — Últimas 5 ciudades persistidas en localStorage
- 🔄 **Toggle °C / °F** — Conversión de temperatura con preferencia guardada
- ✨ **Animaciones** — Entrada suave del WeatherCard con MUI Grow
- 🚫 **Cancelación de requests** — AbortController evita respuestas obsoletas
- 🛡️ **Error codes tipados** — `WeatherServiceError` desacoplado de i18n
- ♿ **Accesibilidad** — Labels ARIA, roles semánticos, screen-reader text
- 📊 Cobertura de tests ≥ 80%

---

## 🏗️ Arquitectura y Patrones de Diseño

| Patrón | Dónde se aplica | Propósito |
|---|---|---|
| **Atomic Design** | `components/{atoms,molecules,organisms,templates}` | Jerarquía de componentes escalable y reutilizable |
| **Service / Repository** | `services/weatherService.ts` | Encapsular toda la lógica de comunicación con la API |
| **Adapter** | `adaptWeatherResponse()` | Transformar la respuesta de OpenWeatherMap a modelo interno |
| **Custom Hook** | `hooks/useWeather.ts` | Separar lógica de estado del UI |
| **Error Codes** | `services/errors.ts` | Desacoplar errores del servicio de la capa de i18n |
| **AbortController** | `hooks/useWeather.ts` | Cancelar requests obsoletos al buscar de nuevo |
| **Barrel Exports** | Archivos `index.ts` | Simplificar imports y controlar API pública |
| **Provider Composition** | `providers/AppProviders.tsx` | Componer Emotion SSR + next-themes + MUI Theme |
| **Centralized Config** | `config/env.ts` | Validar variables de entorno en un solo punto |

---

## 🔧 Requisitos Previos

- **Node.js** 18+ (recomendado: 20 LTS)
- **npm** 9+
- Cuenta gratuita en [OpenWeatherMap](https://openweathermap.org/) para obtener una API Key

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd weather-app

# Instalar dependencias
npm install
```

---

## ⚙️ Configuración

1. Obtén una API Key gratuita en: https://openweathermap.org/api
2. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env.local
```

3. Edita `.env.local` y reemplaza el valor:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=tu_api_key_aquí
```

---

## 🚀 Ejecución

```bash
# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Servir build de producción
npm start

# Formatear código
npm run format

# Verificar formato (CI)
npm run format:check
```

La aplicación estará disponible en: **http://localhost:3000**

---

## 🧪 Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

### Cobertura objetivo: ≥ 80%

### Tests incluidos:

| Suite | Qué verifica |
|---|---|
| `weatherService.test.ts` | API calls, adaptador, error codes (404/401/red/vacío), locale y signal |
| `adaptWeatherResponse` | Función pura: transformación, array vacío, redondeo |
| `useWeather.test.tsx` | Hook aislado: idle→loading→success/error, reset, locale |
| `SearchBar.test.tsx` | Input, submit, loading state, Enter key |
| `WeatherCard.test.tsx` | Temperatura °C/°F, humedad, icono, accesibilidad, toggle |
| `Header.test.tsx` | Título, subtítulo, ThemeToggle, LanguageSwitcher |
| `ErrorMessage.test.tsx` | Role alert, texto de error |
| `LoadingSpinner.test.tsx` | Role status, label para screen readers |
| `ThemeToggle.test.tsx` | Toggle light↔dark |
| `LanguageSwitcher.test.tsx` | Toggle es↔en |
| `Button.test.tsx` | Props por defecto (contained, disableElevation), override |
| `Input.test.tsx` | fullWidth por defecto, disabled, placeholder |
| `Typography.test.tsx` | Renderizado, variant, props forwarding |
| `IconButton.test.tsx` | Render, aria-label, onClick, disabled |
| `page.test.tsx` | Integración: búsqueda exitosa, error, loading, empty state |

---

## 📁 Estructura del Proyecto

```
weather-app/
├── src/
│   ├── app/[locale]/           # App Router con rutas dinámicas por locale
│   │   ├── layout.tsx          # Layout con i18n + providers + generateMetadata
│   │   ├── page.tsx            # Página principal (delega al Template)
│   │   ├── loading.tsx         # Loading UI (Suspense fallback)
│   │   ├── error.tsx           # Error boundary
│   │   └── not-found.tsx       # Página 404
│   ├── components/
│   │   ├── atoms/              # Button, Input, Typography, IconButton
│   │   ├── molecules/          # SearchBar, ErrorMessage, LoadingSpinner,
│   │   │                         EmptyState, SearchHistory
│   │   ├── organisms/          # WeatherCard, Header, ThemeToggle, LanguageSwitcher
│   │   └── templates/          # WeatherTemplate (composición completa)
│   ├── config/                 # Variables de entorno centralizadas
│   ├── hooks/                  # useWeather, useSearchHistory, useTemperatureUnit
│   ├── i18n/                   # Routing y request config de next-intl
│   ├── messages/               # Traducciones (es.json, en.json)
│   ├── providers/              # AppProviders (Emotion + next-themes + MUI)
│   ├── services/               # weatherService, errors (WeatherServiceError)
│   ├── theme/                  # Temas MUI (light + dark)
│   ├── types/                  # Interfaces TypeScript
│   └── __tests__/              # Tests unitarios e integración
│       ├── app/
│       ├── components/atoms/
│       ├── hooks/
│       ├── services/
│       └── helpers/
├── __mocks__/                  # Mock global de next-intl para Jest
├── docs/adr/                   # Architecture Decision Records
├── jest.config.ts
├── jest.setup.ts
├── .env.example
├── .prettierrc
├── eslint.config.mjs
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| **Next.js** | 16 | Framework React con App Router |
| **React** | 19 | Librería de UI |
| **TypeScript** | 5 | Tipado estático |
| **MUI (Material UI)** | 7 | Design System / librería de componentes |
| **Emotion** | 11 | CSS-in-JS (requerido por MUI) |
| **next-intl** | 4 | Internacionalización (i18n) |
| **next-themes** | 0.4 | Modo claro / oscuro |
| **Axios** | 1.13 | Cliente HTTP |
| **Tailwind CSS** | 4 | Utilidades CSS complementarias |
| **Jest** | 30 | Framework de testing |
| **React Testing Library** | 16 | Testing de componentes |
| **Prettier** | 3 | Formateo de código |
| **ESLint** | 9 | Linting |

---

## 📝 Decisiones Arquitectónicas (ADR)

Las decisiones de diseño están documentadas en [`docs/adr/`](docs/adr/):

- [ADR-001: Atomic Design](docs/adr/001-atomic-design.md)
- [ADR-002: MUI como Design System](docs/adr/002-mui-design-system.md)
- [ADR-003: next-intl para i18n](docs/adr/003-next-intl-i18n.md)
- [ADR-004: Manejo de errores tipados](docs/adr/004-typed-error-handling.md)
