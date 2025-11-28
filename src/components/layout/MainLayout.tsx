import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Breadcrumb, theme, ConfigProvider } from 'antd';
import {
    DashboardOutlined, AlertOutlined, TeamOutlined, SettingOutlined,
    MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined,
    MoonOutlined, SunOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme: currentTheme, setTheme } = useTheme();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/alerts-history',
            icon: <AlertOutlined />,
            label: 'Alert History',
        },
        {
            key: '/safe-circle',
            icon: <TeamOutlined />,
            label: 'Safe Circle',
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            handleLogout();
        } else if (key === 'profile') {
            navigate('/settings');
        }
    };

    const userMenu = {
        items: [
            {
                key: 'profile',
                label: 'Profile',
                icon: <UserOutlined />,
            },
            {
                key: 'logout',
                label: 'Logout',
                icon: <LogoutOutlined />,
                danger: true,
            },
        ],
        onClick: handleMenuClick,
    };

    const getBreadcrumbItems = () => {
        const pathSnippets = location.pathname.split('/').filter((i) => i);
        const linkStyle = {
            color: currentTheme === 'dark' ? '#1890ff' : undefined,
            textDecoration: 'none'
        };
        const items = [
            {
                title: <a onClick={() => navigate('/dashboard')} style={linkStyle}>Home</a>
            },
            ...pathSnippets.map((_, index) => {
                const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                const title = pathSnippets[index].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                return {
                    title: index === pathSnippets.length - 1
                        ? <span style={{ color: currentTheme === 'dark' ? '#ffffff' : undefined }}>{title}</span>
                        : <a onClick={() => navigate(url)} style={linkStyle}>{title}</a>,
                };
            }),
        ];
        return items;
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    // Aegis Brand Colors
                    colorPrimary: '#1a237e',      // Deep Blue
                    colorError: '#d32f2f',         // Safety Red
                    colorWarning: '#ff9800',       // Alert Orange
                    colorSuccess: '#4caf50',       // Success Green

                    // Dark Mode Customization
                    ...(currentTheme === 'dark' && {
                        colorBgBase: '#0f1419',        // Base background
                        colorBgContainer: '#1d2b3a',   // Card background
                        colorBgElevated: '#2a3b4c',    // Elevated elements
                        colorText: '#ffffff',
                        colorTextSecondary: 'rgba(255,255,255,0.65)',
                    }),

                    // Light Mode Customization
                    ...(currentTheme !== 'dark' && {
                        colorBgBase: '#ffffff',
                        colorBgContainer: '#f8f9fa',
                        colorBgElevated: '#e9ecef',
                    }),
                },
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider trigger={null} collapsible collapsed={collapsed} theme={currentTheme === 'dark' ? 'dark' : 'light'} style={{ borderRight: '1px solid #f0f0f0' }}>
                    <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>A</div>
                        {!collapsed && <span style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>Aegis</span>}
                    </div>
                    <Menu
                        theme={currentTheme === 'dark' ? 'dark' : 'light'}
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        onClick={({ key }) => navigate(key)}
                        style={{ borderRight: 0 }}
                    />
                </Sider>
                <Layout>
                    <Header style={{
                        padding: '0 24px',
                        background: currentTheme === 'dark' ? '#1d2b3a' : colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: currentTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0'
                    }}>
                        <Space>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{ fontSize: '16px', width: 64, height: 64 }}
                            />
                            <Breadcrumb
                                items={getBreadcrumbItems()}
                                style={{
                                    color: currentTheme === 'dark' ? '#ffffff' : undefined
                                }}
                            />
                        </Space>

                        <Space size="large">
                            <Button
                                type="text"
                                icon={currentTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                                onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                            />
                            <Dropdown menu={userMenu}>
                                <Space style={{ cursor: 'pointer' }}>
                                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                                    <span style={{
                                        fontWeight: 500,
                                        color: currentTheme === 'dark' ? '#ffffff' : undefined
                                    }}>Jane Doe</span>
                                </Space>
                            </Dropdown>
                        </Space>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: 'transparent', // Remove white box
                            overflow: 'auto'
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default MainLayout;
