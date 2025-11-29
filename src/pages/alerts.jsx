import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Select, Input, Typography, Card, Layout, Spin, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { Header, Content } = Layout;

// Mock Data
const MOCK_ALERTS = [
    {
        id: "alert_12345",
        timestamp: "2025-11-28T14:30:00Z",
        type: "medical",
        status: "resolved",
        location: {
            address: "123 Main St, Nairobi",
            coordinates: { lat: -1.2921, lng: 36.8219 }
        },
        triggeredBy: "user",
        description: "User reported severe chest pains and requested immediate medical assistance.",
        responseTime: "00:04:32",
        assignedResponder: "Nairobi EMS Unit 5"
    },
    {
        id: "alert_12346",
        timestamp: "2025-11-28T15:15:00Z",
        type: "fire",
        status: "active",
        location: {
            address: "456 Elm St, Nairobi",
            coordinates: { lat: -1.2921, lng: 36.8219 }
        },
        triggeredBy: "system_auto",
        description: "Smoke detector triggered in Sector 4.",
        responseTime: "00:02:15",
        assignedResponder: "Fire Station 1"
    },
    {
        id: "alert_12347",
        timestamp: "2025-11-28T12:00:00Z",
        type: "security",
        status: "cancelled",
        location: {
            address: "789 Oak Ave, Nairobi",
            coordinates: { lat: -1.2921, lng: 36.8219 }
        },
        triggeredBy: "safe_circle_member",
        description: "Suspicious activity reported by neighbor.",
        responseTime: "00:00:00",
        assignedResponder: "None"
    },
    {
        id: "alert_12348",
        timestamp: "2025-11-27T09:45:00Z",
        type: "natural_disaster",
        status: "false_alarm",
        location: {
            address: "321 Pine Rd, Nairobi",
            coordinates: { lat: -1.2921, lng: 36.8219 }
        },
        triggeredBy: "user",
        description: "Tremors felt, potential earthquake.",
        responseTime: "00:10:00",
        assignedResponder: "Disaster Response Team"
    },
    {
        id: "alert_12349",
        timestamp: "2025-11-27T18:20:00Z",
        type: "medical",
        status: "resolved",
        location: {
            address: "555 Cedar Ln, Nairobi",
            coordinates: { lat: -1.2921, lng: 36.8219 }
        },
        triggeredBy: "user",
        description: "Fall detected, elderly user unresponsive.",
        responseTime: "00:06:45",
        assignedResponder: "Ambulance 3"
    },
    {
        id: "alert_12350",
        timestamp: "2025-11-26T22:10:00Z",
        type: "security",
        status: "active",
        location: {
            address: "999 Birch Blvd, Nairobi",
            coordinates: { lat: -1.2921, lng: 36.8219 }
        },
        triggeredBy: "system_auto",
        description: "Perimeter breach detected.",
        responseTime: "00:03:30",
        assignedResponder: "Security Patrol Alpha"
    },
    {
        id: "alert_12351",
        timestamp: "2025-11-26T14:05:00Z",
        type: "fire",
        status: "resolved",
        location: {
            address: "777 Maple Dr, Nairobi",
            coordinates: { lat: -1.2921, lng: 36.8219 }
        },
        triggeredBy: "user",
        description: "Small kitchen fire reported.",
        responseTime: "00:05:20",
        assignedResponder: "Fire Station 2"
    }
];

const AlertHistory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState([]);
    const [filterStatus, setFilterStatus] = useState([]);

    useEffect(() => {
        // Simulate API fetch
        const fetchData = async () => {
            setLoading(true);
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setData(MOCK_ALERTS);
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter and Search Logic
    const getFilteredData = () => {
        return data.filter(item => {
            const matchesSearch =
                item.id.toLowerCase().includes(searchText.toLowerCase()) ||
                item.description.toLowerCase().includes(searchText.toLowerCase());

            const matchesType = filterType.length === 0 || filterType.includes(item.type);
            const matchesStatus = filterStatus.length === 0 || filterStatus.includes(item.status);

            return matchesSearch && matchesType && matchesStatus;
        });
    };

    const columns = [
        {
            title: 'Alert ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a href="#">{text}</a>,
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
            render: (text) => new Date(text).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', hour12: true
            }),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                let color = 'default';
                if (type === 'medical') color = 'blue';
                if (type === 'fire') color = 'red';
                if (type === 'security') color = 'orange';
                if (type === 'natural_disaster') color = 'volcano';
                return (
                    <Tag color={color} key={type}>
                        {type.toUpperCase().replace('_', ' ')}
                    </Tag>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'active') color = 'red';
                if (status === 'resolved') color = 'green';
                if (status === 'cancelled') color = 'gold';
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase().replace('_', ' ')}
                    </Tag>
                );
            },
        },
        {
            title: 'Location',
            dataIndex: ['location', 'address'],
            key: 'location',
            render: (text) => (
                <span title={text}>
                    {text.length > 30 ? `${text.substring(0, 30)}...` : text}
                </span>
            ),
        },
        {
            title: 'Response Time',
            dataIndex: 'responseTime',
            key: 'responseTime',
            sorter: (a, b) => a.responseTime.localeCompare(b.responseTime),
        },
    ];

    return (
        <Layout style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
            <Content>
                <div style={{ marginBottom: '24px' }}>
                    <Title level={2}>Alert History</Title>
                </div>

                <Card bordered={false} style={{ borderRadius: '8px' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <Input.Search
                            placeholder="Search by ID or Description"
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                        />

                        <Select
                            mode="multiple"
                            placeholder="Filter by Type"
                            style={{ minWidth: 200 }}
                            onChange={setFilterType}
                            allowClear
                        >
                            <Option value="medical">Medical</Option>
                            <Option value="fire">Fire</Option>
                            <Option value="security">Security</Option>
                            <Option value="natural_disaster">Natural Disaster</Option>
                        </Select>

                        <Select
                            mode="multiple"
                            placeholder="Filter by Status"
                            style={{ minWidth: 200 }}
                            onChange={setFilterStatus}
                            allowClear
                        >
                            <Option value="active">Active</Option>
                            <Option value="resolved">Resolved</Option>
                            <Option value="cancelled">Cancelled</Option>
                            <Option value="false_alarm">False Alarm</Option>
                        </Select>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={getFilteredData()}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '20']
                        }}
                    />
                </Card>
            </Content>
        </Layout>
    );
};

export default AlertHistory;
