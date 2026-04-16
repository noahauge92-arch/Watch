import './globals.css'

export const metadata = {
  title: 'ChronosVault | Watch Portfolio Tracker',
  description: 'Professional watch investment tracking and portfolio management platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Sidebar />
          <div className="main-content">
            <TopBar />
            <main className="content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">⌚</div>
          <span className="logo-text">ChronosVault</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavItem href="/" icon="📊" label="Dashboard" active />
        <NavItem href="/add-watch" icon="➕" label="Add Watch" />
        <NavItem href="/portfolio" icon="💼" label="Portfolio" />
        <NavItem href="/analytics" icon="📈" label="Analytics" />
        <NavItem href="/settings" icon="⚙️" label="Settings" />
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">N</div>
          <div className="user-info">
            <div className="user-name data-label">Noah</div>
            <div className="user-status">Pro Member</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ href, icon, label, active = false }) {
  return (
    <a 
      href={href} 
      className={`nav-item ${active ? 'active' : ''}`}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </a>
  )
}

function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">Dashboard</h1>
        <div className="breadcrumb">
          <span className="breadcrumb-item">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Dashboard</span>
        </div>
      </div>
      
      <div className="topbar-right">
        <div className="topbar-stats">
          <div className="stat-item">
            <span className="stat-label data-label">Total Value</span>
            <span className="stat-value metric-value">$847.2K</span>
          </div>
          <div className="stat-item">
            <span className="stat-label data-label">24h Change</span>
            <span className="stat-value status-positive">+2.4%</span>
          </div>
        </div>
        
        <div className="topbar-actions">
          <button className="btn btn-secondary">
            🔔
          </button>
          <button className="btn btn-primary">
            Add Watch
          </button>
        </div>
      </div>
    </header>
  )
}