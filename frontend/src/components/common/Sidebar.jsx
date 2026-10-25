import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building,
  FileText,
  MessageSquare,
  Settings,
  Activity,
  BarChart3,
  Search,
  UserCheck,
  ShieldCheck,
  LogOut,
  FolderCheck,
  Home
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Dashboard & Reports', icon: BarChart3, end: true },
          { to: '/admin/users', label: 'User Management', icon: Users },
          { to: '/admin/listings', label: 'Listing Moderation', icon: Building },
          { to: '/admin/activity', label: 'Activity Monitoring', icon: Activity },
          { to: '/admin/settings', label: 'System Settings', icon: Settings },
        ];
      case 'PROPERTY_MANAGER':
        return [
          { to: '/manager', label: 'Manager Overview', icon: LayoutDashboard, end: true },
          { to: '/manager/properties', label: 'My Listings', icon: Building },
          { to: '/manager/applications', label: 'Rental Applications', icon: UserCheck },
          { to: '/manager/agreements', label: 'Rental Agreements', icon: FileText },
          { to: '/manager/messages', label: 'Tenant Messages', icon: MessageSquare },
          { to: '/manager/analytics', label: 'Listing Analytics', icon: BarChart3 },
        ];
      case 'TENANT':
        return [
          { to: '/tenant', label: 'Tenant Overview', icon: LayoutDashboard, end: true },
          { to: '/properties', label: 'Search Properties', icon: Search },
          { to: '/tenant/applications', label: 'My Applications', icon: FolderCheck },
          { to: '/tenant/agreements', label: 'My Lease Agreements', icon: FileText },
          { to: '/tenant/messages', label: 'Messages', icon: MessageSquare },
          { to: '/tenant/profile', label: 'Profile Overview', icon: UserCheck },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt={user?.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-wide">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-50 to-tealbrand-50/50 text-brand-700 shadow-sm border border-brand-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-brand-600" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Quick Links
        </div>
        <NavLink
          to="/properties"
          className="flex items-center space-x-3 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
        >
          <Home className="w-4 h-4 text-slate-400" />
          <span>Public Listings</span>
        </NavLink>
      </div>

      {/* Logout button in footer */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
