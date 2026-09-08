import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, FolderTree, ClipboardList, 
  Warehouse, Users, Tag, Image, BarChart3, ArrowLeft, LogOut, 
  Menu, X, ChevronLeft, ChevronRight, ExternalLink, Bell, Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StoreStatusBadge } from '../components/common/StoreStatusBadge';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl animate-pulse shadow-md">
            🌿
          </div>
          <p className="text-xs font-bold text-stone-600">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
          🔒
        </div>
        <h2 className="text-xl font-extrabold text-stone-900">Admin Access Required</h2>
        <p className="text-xs text-stone-500">
          You need store administrator permissions to view this portal. Please log in with an admin account.
        </p>
        <Link
          to="/login?redirect=/admin"
          className="inline-block px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-md hover:bg-emerald-800 transition-colors"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/inventory', label: 'Inventory Alerts', icon: Warehouse },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag },
    { to: '/admin/banners', label: 'Banners', icon: Image },
    { to: '/admin/reports', label: 'Sales Reports', icon: BarChart3 },
  ];

  const currentNav = navItems.find((item) => item.to === location.pathname) || navItems[0];

  const renderSidebarContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Admin Header matching screenshot */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-950/40 flex-shrink-0">
              🌿
            </div>
            {(!isCollapsed || isMobile) && (
              <div>
                <h2 className="font-extrabold text-sm text-white leading-tight">Sri Sai Admin</h2>
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                  STORE MANAGER
                </span>
              </div>
            )}
          </div>
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={isCollapsed && !isMobile ? item.label : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                {(!isCollapsed || isMobile) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-6 border-t border-stone-800 space-y-1.5">
        <Link
          to="/"
          title={isCollapsed && !isMobile ? 'Back to Store' : undefined}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>Back to Store</span>}
        </Link>
        <button
          onClick={() => { logout(); navigate('/'); }}
          title={isCollapsed && !isMobile ? 'Logout' : undefined}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* MOBILE TOP HEADER BAR */}
      <header className="md:hidden bg-[#161616] text-white px-4 py-3 border-b border-stone-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            aria-label="Open side menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <div>
              <h1 className="text-xs font-bold text-white">Sri Sai Admin</h1>
              <p className="text-[10px] text-amber-400 font-bold uppercase">{currentNav.label}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER BACKDROP */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* MOBILE SLIDE-OVER SIDE MENU BAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#161616] text-stone-300 p-5 z-50 md:hidden shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent(true)}
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-[#161616] text-stone-300 p-5 border-r border-stone-800/80 sticky top-0 h-screen transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* DESKTOP TOP BAR */}
        <header className="hidden md:flex items-center justify-between px-6 py-3.5 bg-white border-b border-stone-200 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400">Admin</span>
              <span className="text-stone-300">/</span>
              <span className="font-bold text-stone-800">{currentNav.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StoreStatusBadge compact />
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-800 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <span>View Customer Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </Link>
            <div className="h-4 w-px bg-stone-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-bold text-stone-700">{user?.name || 'Store Administrator'}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
