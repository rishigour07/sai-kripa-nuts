import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from '../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Inventory', href: '/admin/inventory' },
  { name: 'Profit and Loss', href: '/admin/profit-loss' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuth');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans flex justify-center p-8">
      <div className="w-full max-w-[1200px]">
        {/* Top Header Block */}
        <div className="bg-[#0E4B32] rounded-t-3xl h-24 flex items-center justify-between px-10">
          <h1 className="text-white text-2xl font-bold tracking-wide">Product Admin Panel</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        <div className="flex mt-8 gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-[#F5F0E6] rounded-3xl p-6 flex-shrink-0 h-fit">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      'block px-6 py-3.5 text-[15px] font-medium rounded-2xl transition-all duration-200',
                      isActive || (item.href === '/admin/products' && window.location.pathname.includes('/admin/products'))
                        ? 'bg-[#0E4B32] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-[#DDE7D8] hover:text-[#0E4B32]'
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
