# 🏀 BasketBall LiveScore

A modern, high-performance, real-time web application for tracking basketball matches, live scores, and team standings.

This project combines an **Angular 17** frontend with a robust **ASP.NET Core 8** backend to deliver a seamless, aesthetic experience complete with a dark mode, bilingual interface (English/French), and real-time updates using SignalR.

---

- **Real-time Live Scores**: Live matches are updated instantly using WebSockets (SignalR). No manual refresh required!
- **Encoder Dashboard**: Secured features for "Encoder" accounts to manage matches, add scores, timeouts, and fouls live.
- **ESPN API Integration**: Automatically fetches the next 7 days of NBA upcoming matches via a backend proxy to bypass CORS and consolidate queries.
- **Dynamic UI/UX**:
  - Fully responsive, mobile-first design using Tailwind CSS.
  - Custom "Sports" typography for that authentic scoreboard feel.
  - Micro-animations, glow effects, and a persistent Dark/Light Mode.
- **Internationalization (i18n)**: Instantly switch between English and French without reloading.
- **Legal & GDPR Compliance**: Integrated pages for Legal Notices, Privacy Policy, and Terms of Service (TOS), fully translated.
- **Performance Optimized**: Uses Angular's `ChangeDetectionStrategy.OnPush` and `trackBy` functions for buttery smooth array updates.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 17 (Standalone Components)
- **Styling**: Tailwind CSS
- **Translation**: `@ngx-translate/core`
- **Real-time**: `@microsoft/signalr`

### Backend
- **Framework**: ASP.NET Core 8 Web API
- **Database**: Entity Framework Core (In-Memory/SQL Server)
- **Real-time**: SignalR Hubs
- **Proxy**: HTTP Client factory for external API (ESPN) consumption

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Angular CLI](https://angular.io/cli) (v17+)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/BasketBall_LiveScore.git
cd BasketBall_LiveScore
```

### 2. Setup the Backend (.NET)
```bash
cd BasketBall_LiveScore.Server
dotnet restore
dotnet run
```
The API will run on `http://localhost:61961` (or the port specified in `launchSettings.json`).

### 3. Setup the Frontend (Angular)
```bash
cd ../basketball_livescore.client
npm install
npm start
```
The frontend will be available at `http://localhost:4200`.

---

## 📝 Configuration

- **API URL**: The frontend is pre-configured to proxy requests to the backend in development via `proxy.conf.js`.
- **Theme**: The theme relies on custom CSS variables (`--brand-dark`, `--brand-accent`, etc.) defined in `src/styles.css`. It automatically hooks into `localStorage` to save user preferences.

---

## 💡 About the Code Architecture
- The application makes heavy use of **RxJS** for state management and reactive data flows.
- **ESPN Proxy**: Due to ESPN's API throwing CORS and 400 Bad Request errors on date ranges, the backend actively pulls the API's calendar, parallelizes requests for the next 7 days, and serves it as a clean merged JSON object to the frontend.

## 📄 License
This project is licensed under the MIT License.
