# ChronosVault: Watch Investment Tracking Application

ChronosVault is a modern, fintech-style dashboard designed for watch collectors to track the financial performance of their timepieces, analyze return on investment (ROI), and visualize their portfolio evolution over time.

## 🚀 Features

- **Portfolio Dashboard**: High-level metrics, total value, profit/loss tracking, and ROI.
- **Investment Analysis**: Historical price charts vs. invested amount, brand distribution, and growth forecasting.
- **Watch Management (Add Watch)**: Detailed form to input reference numbers, purchase prices, dates, and current estimated values.
- **Modern Fintech UI**: Premium dark mode design, glowing accents, and interactive data visualization.
- **Bonus Feature**: Included growth forecasting ("Future Value Estimator").

## 📁 Project Structure

```
watch-portfolio-tracker/
├── backend/              # Node.js Express API
│   ├── index.js         # Main server with all routes
│   ├── package.json     # Backend dependencies
│   └── .env.example     # Environment variables template
├── database/            # PostgreSQL schema
│   └── schema.sql       # Database structure
├── web/                 # Next.js Frontend Application
│   ├── app/
│   │   ├── globals.css           # Dark fintech design system
│   │   ├── layout.js             # Root layout with sidebar/topbar
│   │   ├── page.js               # Dashboard with charts & metrics
│   │   ├── add-watch/
│   │   │   └── page.js           # Comprehensive watch form
│   │   └── portfolio/
│   │       └── page.js           # Advanced portfolio analysis
│   ├── package.json              # Frontend dependencies
│   └── next.config.js            # Next.js configuration
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 App Router, React 18
- **Styling**: Vanilla CSS with custom dark fintech design system
- **Charts**: Recharts for interactive data visualization
- **Backend**: Node.js with Express 5 (fully implemented API)
- **Database**: PostgreSQL with connection pooling
- **Development**: Hot reload with nodemon

## 🖥️ Local Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/noahauge92-arch/Watch.git watch-portfolio-tracker
cd watch-portfolio-tracker
```

### 2. Database Setup
Ensure PostgreSQL is installed and running:
```bash
# Create database
psql -U postgres -c "CREATE DATABASE chronos_vault;"

# Run schema
psql -U postgres -d chronos_vault -f database/schema.sql
```

### 3. Backend Setup
```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
# Server runs on http://localhost:3001
```

### 4. Frontend Setup (New Terminal)
```bash
cd web
npm install

# Start Next.js development server
npm run dev
# Frontend runs on http://localhost:3000
```

### 5. Test the Application
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Health**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

## 🚀 Available API Endpoints

- `GET /api/watches` - Get all watches
- `GET /api/watches/:id` - Get specific watch
- `POST /api/watches` - Add new watch
- `PUT /api/watches/:id` - Update watch
- `DELETE /api/watches/:id` - Delete watch
- `GET /api/portfolio/stats` - Portfolio statistics
- `GET /api/portfolio/brands` - Brand distribution
- `POST /api/watches/:id/price` - Add historical price

## 📈 Charts and Data Visualization
ChronosVault heavily utilizes `Recharts` for interactive graphing:
- **Area Charts** for trailing portfolio value evolution versus invested amounts.
- **Pie Charts** for portfolio distribution categorizing watch brands.
- **Bar Charts** for individual watch ROI and profitability comparisons.
- **Metrics Cards** for top-line financial aggregations (Total Value, ROI, Active Pieces).
