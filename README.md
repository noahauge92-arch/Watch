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
watch/
├── backend/          # Node.js backend setup (initialized)
├── database/         # PostgreSQL schema definition
│   └── schema.sql    
├── frontend/         # Next.js React application
│   ├── app/
│   │   ├── components/
│   │   │   ├── Dashboard.js     # Main dashboard with charts
│   │   │   ├── Layout.js        # Responsive sidebar/topbar layout
│   │   ├── add-watch/
│   │   │   └── page.js          # Add Watch form
│   │   ├── portfolio/
│   │   │   └── page.js          # Detailed portfolio analysis view
│   │   ├── globals.css          # Core design system and global styles
│   │   ├── layout.js            # Root layout
│   │   └── page.js              # Home page
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: Next.js App Router, React
- **Styling**: Vanilla CSS (Fintech dark theme)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Node.js, Express (initialized for future integration)
- **Database**: PostgreSQL

## 🖥️ Local Setup & Installation

### 1. Database Setup
Ensure you have PostgreSQL installed. Run the schema creation script to set up your tables:
```bash
psql -U your_user -d your_db -f database/schema.sql
```

### 2. Backend Setup
Navigate to the backend folder and install the dependencies:
```bash
cd backend
npm install
node index.js  # (Once Express routes are wired up)
```

### 3. Frontend Setup
Navigate to the frontend folder, install dependencies, and start the Next.js development server:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

## 📈 Charts and Data Visualization
ChronosVault heavily utilizes `Recharts` for interactive graphing:
- **Area Charts** for trailing portfolio value evolution versus invested amounts.
- **Pie Charts** for portfolio distribution categorizing watch brands.
- **Bar Charts** for individual watch ROI and profitability comparisons.
- **Metrics Cards** for top-line financial aggregations (Total Value, ROI, Active Pieces).
