# React + TypeScript + Vite
AgriPrice is a full-stack web application designed for the agricultural sector, primarily focused on tracking, monitoring, and analyzing agricultural commodity prices across different markets.

Key Features & Architecture:
1. Frontend (User Interface):

Tech Stack: Built using modern web technologies including React, TypeScript, and Vite for fast performance and development.
Styling & UI: Uses Tailwind CSS for responsive design and Lucide React for UI icons.
Data Visualization: Integrates Recharts to display price trends and historical data visually through charts.
Routing & PWA: Uses react-router-dom for navigation (e.g., Auth, Profile, Landing pages) and includes Progressive Web App (PWA) support (vite-plugin-pwa) for mobile-friendly, offline-capable usage.
BaaS Integration: Includes the Supabase client, suggesting it might leverage Supabase for real-time features, storage, or supplementary authentication.
2. Backend (Server & API):

Tech Stack: Powered by Node.js and Express.js.
Database: Uses MongoDB (via Mongoose) as the primary database to store application data.
Core Entities & Routes: The backend exposes RESTful APIs for:
commodities: Managing different crops/agricultural products.
mandis: Managing market locations (Mandis).
prices: Handling the pricing data for commodities at specific mandis.
alerts: A system (likely for users to set up price drop/rise notifications).
chat: A communication module (possibly an AI assistant or a forum/messaging feature).
auth: User authentication and authorization.
In summary, it's a comprehensive platform allowing agricultural stakeholders (like farmers or traders) to stay updated on market prices, analyze trends, set alerts for specific price points, and manage their profiles.


This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
