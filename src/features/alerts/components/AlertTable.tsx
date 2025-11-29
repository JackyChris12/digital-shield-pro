import React from 'react';
import { Table, Tag, Badge, Avatar, Space, Button } from 'antd';
import { Alert, AlertSeverity, AlertStatus, AlertType, Platform } from '../types';
import {
    MobileOutlined, GlobalOutlined, ClockCircleOutlined,
    FireOutlined, WarningOutlined, SafetyCertificateOutlined,
    TwitterOutlined, InstagramOutlined, WhatsAppOutlined, MailOutlined, GlobalOutlined as WebOutlined, VideoCameraOutlined
} from '@ant-design/icons';

interface AlertTableProps {
    data: Alert[];
    loading: boolean;
    onViewDetails?: (alert: Alert) => void;
}

const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
        case 'critical': return 'red';
        case 'high': return 'orange';
        case 'medium': return 'gold';
        case 'low': return 'blue';
        default: return 'default';
    }
};

const getStatusBadgeStatus = (status: AlertStatus): 'success' | 'processing' | 'error' | 'default' | 'warning' => {
    switch (status) {
        case 'active': return 'processing';
        case 'resolved': return 'success';
        case 'escalated': return 'error';
        case 'reviewed': return 'default';
        case 'false_alarm': return 'warning';
        default: return 'default';
    }
};

const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
        case 'twitter': return <TwitterOutlined style={{ color: '#1DA1F2' }} />;
        case 'instagram': return <InstagramOutlined style={{ color: '#E1306C' }} />;
        case 'tiktok': return <VideoCameraOutlined style={{ color: '#000000' }} />;
        case 'email': return <MailOutlined style={{ color: '#EA4335' }} />;
        case 'web': return <WebOutlined style={{ color: '#888' }} />;
        default: return <GlobalOutlined />;
    }
};

const AlertTable: React.FC<AlertTableProps> = ({ data, loading, onViewDetails }) => {
    const columns = [
        {
            title: 'Platform & Threat',
            dataIndex: 'platform',
            key: 'platform',
            width: 280,
            render: (text: string, record: Alert) => (
                <Space align="start" style={{ cursor: 'pointer' }} onClick={() => onViewDetails?.(record)}>
                    <Avatar
                        shape="square"
                        size="large"
                        icon={getPlatformIcon(record.platform)}
                        style={{
                            backgroundColor: record.severity === 'critical' ? '#ff4d4f' : '#f0f0f0'
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{record.platform.toUpperCase()}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{record.id}</div>
                        <Tag color={getSeverityColor(record.severity)} style={{ marginTop: 4 }}>
                            {record.threat_type.replace('_', ' ').toUpperCase()}
                        </Tag>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Content Preview',
            dataIndex: 'content',
            key: 'content',
            width: 300,
            render: (content: Alert['content']) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{content.sender}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                        {content.message.substring(0, 60)}...
                    </div>
                </div>
            ),
        },
        {
            title: 'AI Analysis',
            dataIndex: 'ai_analysis',
            key: 'ai_analysis',
            width: 150,
            render: (ai: Alert['ai_analysis']) => (
                <div>
                    <div style={{ fontWeight: 500, color: ai.toxicity_score > 0.7 ? '#ff4d4f' : '#52c41a' }}>
                        {Math.round(ai.toxicity_score * 100)}% toxic
                    </div>
                    <div style={{ fontSize: '11px', color: '#888' }}>
                        {Math.round(ai.confidence * 100)}% confident
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: AlertStatus) => (
                <Badge status={getStatusBadgeStatus(status)} text={status.toUpperCase()} />
            ),
        },
        {
            title: 'Safe Circle',
            dataIndex: 'safeCircle',
            key: 'safeCircle',
            width: 150,
            render: (safeCircle: Alert['safeCircle']) => (
                <div>
                    {safeCircle.notified && (
                        <>
                            <div style={{ fontSize: '12px' }}>
                                <span style={{ fontWeight: 500 }}>{safeCircle.responses.length}</span> / {safeCircle.notified_count} responded
                            </div>
                            {safeCircle.response_time && (
                                <div style={{ fontSize: '11px', color: '#888' }}>
                                    <ClockCircleOutlined /> {safeCircle.response_time}
                                </div>
                            )}
                        </>
                    )}
                    {!safeCircle.notified && <span style={{ color: '#888' }}>Not notified</span>}
                </div>
            ),
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 180,
            sorter: (a: Alert, b: Alert) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
            render: (timestamp: string) => (
                <div>
                    <div>{new Date(timestamp).toLocaleDateString()}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>
                        {new Date(timestamp).toLocaleTimeString()}
                    </div>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_: any, record: Alert) => (
                <Space>
                    <Button size="small" type="link" onClick={() => onViewDetails?.(record)}>Details</Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} alerts`,
            }}
            scroll={{ x: 'max-content' }}
        />
    );
};

export default AlertTable;
