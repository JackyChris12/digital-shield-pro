import React from 'react';
import { Modal, Descriptions, Tag, Badge, Timeline, Typography, Button, Space, Alert as AntAlert, Divider } from 'antd';
import { Alert } from '../types';
import {
    ClockCircleOutlined, EnvironmentOutlined, UserOutlined,
    SafetyCertificateOutlined, WarningOutlined, CheckCircleOutlined,
    StopOutlined, FlagOutlined, PhoneOutlined
} from '@ant-design/icons';
import PlatformIcon from './PlatformIcon';
import AIAnalysisPanel from './AIAnalysisPanel';

const { Text, Title, Paragraph } = Typography;

interface AlertDetailsModalProps {
    visible: boolean;
    alert: Alert | null;
    onClose: () => void;
    onEscalate: (id: string) => void;
    onResolve: (id: string) => void;
}

const AlertDetailsModal: React.FC<AlertDetailsModalProps> = ({
    visible, alert, onClose, onEscalate, onResolve
}) => {
    if (!alert) return null;

    return (
        <Modal
            title={
                <Space>
                    <SafetyCertificateOutlined />
                    <span>Alert Details: {alert.id}</span>
                    <PlatformIcon platform={alert.platform} size={20} />
                </Space>
            }
            open={visible}
            onCancel={onClose}
            width={900}
            footer={[
                <Button key="close" onClick={onClose}>Close</Button>,
                <Button
                    key="block"
                    icon={<StopOutlined />}
                    onClick={() => alert.id}
                    disabled={alert.user_actions.some(a => a.action === 'blocked_sender')}
                >
                    Block Sender
                </Button>,
                <Button
                    key="report"
                    icon={<FlagOutlined />}
                    onClick={() => alert.id}
                    disabled={alert.user_actions.some(a => a.action === 'reported_platform')}
                >
                    Report to {alert.platform.toUpperCase()}
                </Button>,
                <Button
                    key="escalate"
                    danger
                    icon={<PhoneOutlined />}
                    onClick={() => onEscalate(alert.id)}
                    disabled={alert.status === 'escalated' || alert.status === 'resolved'}
                >
                    Escalate to Authorities
                </Button>,
                <Button
                    key="resolve"
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => onResolve(alert.id)}
                    disabled={alert.status === 'resolved'}
                >
                    Mark Resolved
                </Button>,
            ]}
        >
            {/* Content Warning */}
            {alert.content.message.includes('[FLAGGED CONTENT:') && (
                <AntAlert
                    message="Content Warning"
                    description="This alert contains potentially disturbing content that has been flagged by our AI system."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                {/* Left Column: Details */}
                <div>
                    <Title level={5}>Message Content</Title>
                    <div style={{
                        padding: 16,
                        background: '#f5f5f5',
                        borderRadius: 8,
                        borderLeft: `4px solid ${alert.severity === 'critical' ? '#ff4d4f' : '#ff9800'}`,
                        marginBottom: 16
                    }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong>From: {alert.content.sender}</Text>
                            <Paragraph style={{ margin: 0 }}>{alert.content.message}</Paragraph>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                <ClockCircleOutlined /> {new Date(alert.content.timestamp).toLocaleString()}
                            </Text>
                        </Space>
                    </div>

                    <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                        <Descriptions.Item label="Status" span={1}>
                            <Badge
                                status={alert.status === 'active' ? 'processing' : 'default'}
                                text={alert.status.toUpperCase()}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Severity" span={1}>
                            <Tag color={alert.severity === 'critical' ? 'red' : 'orange'}>
                                {alert.severity.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Threat Type" span={1}>
                            {alert.threat_type.replace('_', ' ').toUpperCase()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Platform" span={1}>
                            <Space>
                                <PlatformIcon platform={alert.platform} size={16} />
                                {alert.platform.toUpperCase()}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Detection Method" span={2}>
                            {alert.trigger === 'ai_detection' ? 'AI Threat Detection' : alert.trigger.toUpperCase()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Location" span={2}>
                            <Space direction="vertical" size={0}>
                                <Text><EnvironmentOutlined /> {alert.location.address}</Text>
                                <Text type="secondary" style={{ fontSize: '11px' }}>
                                    IP: {alert.location.ip_address} | {alert.location.approximate_location}
                                </Text>
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Safe Circle Response */}
                    {alert.safeCircle.notified && (
                        <>
                            <Title level={5}>Safe Circle Response</Title>
                            <Timeline mode="left">
                                {alert.safeCircle.responses.map((resp, idx) => (
                                    <Timeline.Item
                                        key={idx}
                                        color={resp.response === 'acknowledged' || resp.response === 'on_way' ? 'green' :
                                            resp.response === 'contacted_authorities' ? 'blue' : 'gray'}
                                        label={resp.timestamp ? new Date(resp.timestamp).toLocaleTimeString() : 'Pending'}
                                    >
                                        <strong>{resp.contactName}</strong>: {resp.response.replace('_', ' ')} via {resp.method}
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                            {alert.safeCircle.response_time && (
                                <Text type="secondary">
                                    Average response time: <strong>{alert.safeCircle.response_time}</strong>
                                </Text>
                            )}
                        </>
                    )}

                    {/* Action Timeline */}
                    {alert.user_actions.length > 0 && (
                        <>
                            <Divider />
                            <Title level={5}>Actions Taken</Title>
                            <Timeline>
                                {alert.user_actions.map((action, idx) => (
                                    <Timeline.Item
                                        key={idx}
                                        color={action.automated ? 'blue' : 'green'}
                                    >
                                        <Space direction="vertical" size={0}>
                                            <Text strong>
                                                {action.action.replace('_', ' ').toUpperCase()}
                                                {action.automated && <Tag color="blue" style={{ marginLeft: 8 }}>AUTO</Tag>}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                {new Date(action.timestamp).toLocaleString()}
                                            </Text>
                                            {action.details && <Text type="secondary" style={{ fontSize: '12px' }}>{action.details}</Text>}
                                        </Space>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </>
                    )}
                </div>

                {/* Right Column: AI Analysis */}
                <div>
                    <AIAnalysisPanel analysis={alert.ai_analysis} />

                    {alert.integration && (
                        <div style={{ marginTop: 16, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
                            <Text strong>Platform Integration</Text>
                            <div style={{ marginTop: 8 }}>
                                <Text style={{ fontSize: '12px' }}>
                                    <Badge status={alert.integration.sync_status === 'active' ? 'success' : 'error'} />
                                    {alert.integration.platform} - {alert.integration.sync_status.toUpperCase()}
                                </Text>
                            </div>
                            {alert.integration.last_sync && (
                                <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: 4 }}>
                                    Last sync: {new Date(alert.integration.last_sync).toLocaleString()}
                                </Text>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default AlertDetailsModal;
