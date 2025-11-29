import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Bell, Users, Settings, Shield } from 'lucide-react';

interface MobileBottomNavProps {
    className?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            key: '/dashboard',
            icon: Home,
            label: 'Home',
        },
        {
            key: '/alerts-history',
            icon: Bell,
            label: 'Alerts',
        },
        {
            key: '/social-monitoring',
            icon: Shield,
            label: 'Monitor',
        },
        {
            key: '/safe-circle',
            icon: Users,
            label: 'Circle',
        },
        {
            key: '/settings',
            icon: Settings,
            label: 'Settings',
        },
    ];

    const handleNavClick = (path: string) => {
        navigate(path);
    };

    return (
        <nav className={`bottom-nav mobile-only ${className}`}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.key;

                return (
                    <button
                        key={item.key}
                        onClick={() => handleNavClick(item.key)}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        aria-label={item.label}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            minHeight: '44px',
                            padding: '8px',
                        }}
                    >
                        <Icon className="nav-icon" size={24} />
                        <span className="nav-label">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default MobileBottomNav;
