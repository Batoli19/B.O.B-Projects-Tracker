import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface font-body text-textPrimary">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 p-6">
            <div key={location.pathname} className="page-fade">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
