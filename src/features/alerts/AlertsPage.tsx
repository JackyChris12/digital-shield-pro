import React, { useState } from 'react';
import { Typography, Card, Input, Space, Button, Statistic, Row, Col, message } from 'antd';
import { FilterOutlined, ReloadOutlined, BellOutlined, FireOutlined, DownloadOutlined } from '@ant-design/icons';
import { useTheme } from 'next-themes';
import AlertTable from './components/AlertTable';
import AlertDetailsModal from './components/AlertDetailsModal';
import { useRealtimeAlerts } from '../../hooks/useRealtimeAlerts';
import { Alert } from './types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const { Title, Text } = Typography;

const AlertsPage = () => {
    const { alerts = [], loading: isLoading, addDemoAlert, clearAlerts, refetch } = useRealtimeAlerts();
    const [searchText, setSearchText] = useState('');
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { theme: currentTheme } = useTheme();
    const isDark = currentTheme === 'dark';

    const filteredAlerts = alerts.filter(alert =>
        alert.id.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.threat_type.includes(searchText.toLowerCase()) ||
        alert.platform.includes(searchText.toLowerCase()) ||
        alert.content.message.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.content.sender.toLowerCase().includes(searchText.toLowerCase())
    );

    const activeAlerts = alerts.filter(a => a.status === 'active').length;
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
    const avgToxicity = alerts.length > 0
        ? Math.round((alerts.reduce((sum, a) => sum + a.ai_analysis.toxicity_score, 0) / alerts.length) * 100)
        : 0;
    const platformCounts = alerts.reduce((acc, alert) => {
        acc[alert.platform] = (acc[alert.platform] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleRefresh = async () => {
        await refetch();
        message.success('Alerts updated successfully');
    };

    const handleAddDemo = async () => {
        const result = await addDemoAlert();
        if (result?.error) {
            message.error('Failed to add demo alert: ' + result.error.message);
        } else {
            message.success('Demo alert added');
        }
    };

    const handleClear = async () => {
        await clearAlerts();
        message.success('All alerts cleared');
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "ID,Platform,Threat Type,Severity,Status,Toxicity Score,Sender,Timestamp\n"
            + filteredAlerts.map(e =>
                `${e.id},${e.platform},${e.threat_type},${e.severity},${e.status},${Math.round(e.ai_analysis.toxicity_score * 100)}%,"${e.content.sender}",${e.timestamp}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "aegis_threats_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('Export started');
    };

    const handleViewDetails = (alert: Alert) => {
        setSelectedAlert(alert);
        setModalVisible(true);
    };

    const handleEscalate = (id: string) => {
        message.warning(`Alert ${id} escalated to emergency services`);
        setModalVisible(false);
    };

    const handleResolve = (id: string) => {
        message.success(`Alert ${id} marked as resolved`);
        setModalVisible(false);
    };

    // Premium glassmorphism card style
    const cardStyle = isDark ? {
        background: 'rgba(29, 43, 58, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
    } : {
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '12px',
    };

    return (
        <div style={{ padding: '0 8px' }}>
            {/* Header */}
            <div style={{
                marginBottom: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div>
                    <Title level={2} style={{ margin: 0, color: isDark ? '#ffffff' : '#000000' }}>
                        <BellOutlined /> Aegis Shield - Threat Detection
                    </Title>
                    <Text style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)' }}>
                        Real-time Platform Monitoring & AI Analysis
                    </Text>
                </div>
                <Space>
                    <Button onClick={handleAddDemo}>Add Demo Alert</Button>
                    <Button danger onClick={handleClear}>Clear All</Button>
                    <Button
                        icon={<ReloadOutlined spin={isLoading} />}
                        onClick={handleRefresh}
                        loading={isLoading}
                    >
                        Refresh
                    </Button>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
                        Export Report
                    </Button>
                </Space>
            </div>

            {/* Premium Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={cardStyle}>
                        <Statistic
                            title={<span style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)' }}>Active Threats</span>}
                            value={activeAlerts}
                            valueStyle={{ color: '#d32f2f', fontWeight: 600 }}
                            prefix={<FireOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={cardStyle}>
                        <Statistic
                            title={<span style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)' }}>Critical Severity</span>}
                            value={criticalAlerts}
                            valueStyle={{ color: '#d32f2f', fontWeight: 600 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={cardStyle}>
                        <Statistic
                            title={<span style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)' }}>Avg AI Toxicity</span>}
                            value={avgToxicity}
                            suffix="%"
                            valueStyle={{ color: avgToxicity > 70 ? '#d32f2f' : '#4caf50', fontWeight: 600 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={cardStyle}>
                        <Statistic
                            title={<span style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)' }}>Total Platforms</span>}
                            value={Object.keys(platformCounts).length}
                            valueStyle={{ color: '#1a237e', fontWeight: 600 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                <Col xs={24} lg={12}>
                    <Card title="Alert Type Distribution" bordered={false} style={cardStyle}>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={alerts.reduce((acc: any[], curr) => {
                                            const existing = acc.find(item => item.name === curr.threat_type);
                                            if (existing) existing.value++;
                                            else acc.push({ name: curr.threat_type, value: 1 });
                                            return acc;
                                        }, [])}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF69B4', '#FFD700'].map((color, idx) => (
                                            <Cell key={`cell-${idx}`} fill={color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1d2b3a' : '#fff', border: 'none' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Response Time Trend (Last 24h)" bordered={false} style={cardStyle}>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={[
                                    { name: '00-04', time: 120 },
                                    { name: '04-08', time: 200 },
                                    { name: '08-12', time: 150 },
                                    { name: '12-16', time: 80 },
                                    { name: '16-20', time: 70 },
                                    { name: '20-24', time: 110 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a3b4c' : '#e0e0e0'} />
                                    <XAxis dataKey="name" stroke={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'} />
                                    <YAxis stroke={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'} />
                                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1d2b3a' : '#fff', border: 'none' }} />
                                    <Legend />
                                    <Bar dataKey="time" fill="#1890ff" name="Avg Response (sec)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Table */}
            <Card bordered={false} style={{ ...cardStyle, marginBottom: '24px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Input.Search
                        placeholder="Search ID, Platform, Sender, Message..."
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: '100%', maxWidth: 400 }}
                        enterButton
                    />
                    <Button icon={<FilterOutlined />}>Advanced Filters</Button>
                </div>

                <AlertTable
                    data={filteredAlerts}
                    loading={isLoading}
                    onViewDetails={handleViewDetails}
                />
            </Card>

            <AlertDetailsModal
                visible={modalVisible}
                alert={selectedAlert}
                onClose={() => setModalVisible(false)}
                onEscalate={handleEscalate}
                onResolve={handleResolve}
            />
        </div>
    );
};

export default AlertsPage;
