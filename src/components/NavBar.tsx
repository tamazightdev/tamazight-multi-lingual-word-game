import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Trophy, Settings } from 'lucide-react';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/lobby', label: 'Players', icon: Users },
    { path: '/high-scores', label: 'Leaderboard', icon: Trophy },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-surface-light backdrop-blur-[10px] w-full py-3 border-t border-white/20">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`nav-icon ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={20} className="text-white drop-shadow-sm" />
                <span className="text-xs mt-1 text-shadow">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavBar;