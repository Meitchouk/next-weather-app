# 🌤️ Weather App — Aplicación de Clima

Aplicación web para consultar el clima actual de cualquier ciudad del mundo. Construida con **Next.js 16**, **TypeScript**, **Tailwind CSS** y la API de **OpenWeatherMap**.

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

---

## ✨ Características

- Búsqueda del clima actual por nombre de ciudad
- Muestra temperatura (°C), humedad (%) y descripción del clima
- Iconos del clima dinámicos
- Manejo de errores amigable (ciudad no encontrada, API key inválida, red)
- Diseño responsivo con Tailwind CSS
- Accesibilidad (labels ARIA, roles semánticos)
- Cobertura de tests > 80%

---

## 🏗️ Arquitectura y Patrones de Diseño

| Patrón | Dónde se aplica | Propósito |
|---|---|---|
| **Service/Repository** | `services/weatherService.ts` | Encapsular toda la lógica de comunicación con la API externa |
| **Adapter** | `adaptWeatherResponse()` | Transformar la respuesta de OpenWeatherMap a nuestro modelo interno |
| **Custom Hook** | `hooks/useWeather.ts` | Separar lógica de estado y negocio de los componentes de UI |
| **Container/Presentational** | `page.tsx` ↔ componentes | La página orquesta; los componentes solo presentan datos |
| **Single Responsibility** | Cada componente | Un componente = una responsabilidad clara |
| **Barrel Exports** | Archivos `index.ts` | Simplificar imports y controlar la API pública de cada módulo |

---

## 🔧 Requisitos Previos

- **Node.js** 18+ (recomendado: 20 LTS)
- **npm** 9+
- Cuenta gratuita en [OpenWeatherMap](https://openweathermap.org/) para obtener una API Key

---

## 📦 Instalación

```bash
# Clonar el repositorio (si aplica)
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
# Modo desarrollo (con hot-reload)
npm run dev

# Build de producción
npm run build

# Servir build de producción
npm start
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

| Métrica | Cobertura |
|---|---|
| Statements | 96.6% |
| Branches | 82.1% |
| Functions | 91.7% |
| Lines | 96.2% |

### Tests incluidos:

- **weatherService.test.ts** — Llamadas a la API, adaptador de datos, manejo de errores 404/401/red
- **SearchBar.test.tsx** — Input, submit, estado loading, Enter key
- **WeatherCard.test.tsx** — Muestra correcta de temperatura, humedad, descripción, icono
- **ErrorMessage.test.tsx** — Role alert, texto de error
- **LoadingSpinner.test.tsx** — Role status, label para screen readers
- **page.test.tsx** — Integración: búsqueda exitosa, error, estado loading

---

## 📁 Estructura del Proyecto

```
weather-app/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Layout root
│   │   ├── page.tsx          # Página principal (Container)
│   │   └── globals.css       # Estilos globales + Tailwind
│   ├── components/           # Componentes presentacionales
│   │   ├── SearchBar.tsx     # Barra de búsqueda
│   │   ├── WeatherCard.tsx   # Tarjeta de información del clima
│   │   ├── ErrorMessage.tsx  # Mensaje de error
│   │   ├── LoadingSpinner.tsx# Spinner de carga
│   │   └── index.ts          # Barrel export
│   ├── hooks/                # Custom hooks
│   │   ├── useWeather.ts     # Hook de lógica de búsqueda del clima
│   │   └── index.ts
│   ├── services/             # Capa de servicios (API)
│   │   ├── weatherService.ts # Servicio OpenWeatherMap
│   │   └── index.ts
│   ├── types/                # Tipos TypeScript
│   │   ├── weather.ts        # Modelos de datos del clima
│   │   └── index.ts
│   └── __tests__/            # Tests unitarios e integración
│       ├── app/
│       ├── components/
│       └── services/
├── jest.config.ts            # Configuración Jest
├── jest.setup.ts             # Setup de @testing-library/jest-dom
├── .env.example              # Variables de entorno de ejemplo
├── .env.local                # Variables de entorno (no versionado)
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## 🛠️ Tecnologías

- **Next.js 16** — Framework React con App Router
- **TypeScript** — Tipado estático
- **Tailwind CSS 4** — Utilidades CSS
- **Axios** — Cliente HTTP
- **Jest 30** — Framework de testing
- **React Testing Library** — Testing de componentes
- **OpenWeatherMap API** — Datos meteorológicos
