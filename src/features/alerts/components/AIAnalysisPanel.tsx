import React from 'react';
import { Card, Progress, Tag, Space, Typography } from 'antd';
import { AIAnalysis } from '../types';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface AIAnalysisPanelProps {
    analysis: AIAnalysis;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ analysis }) => {
    const toxicityPercent = Math.round(analysis.toxicity_score * 100);
    const confidencePercent = Math.round(analysis.confidence * 100);

    const getToxicityColor = (score: number) => {
        if (score >= 70) return '#ff4d4f';
        if (score >= 50) return '#ff9800';
        if (score >= 30) return '#faad14';
        return '#52c41a';
    };

    return (
        <Card
            title={
                <Space>
                    <WarningOutlined />
                    <span>AI Threat Analysis</span>
                </Space>
            }
            bordered={false}
            size="small"
        >
            <div style={{ marginBottom: 16 }}>
                <Text strong>Toxicity Score</Text>
                <Progress
                    percent={toxicityPercent}
                    strokeColor={getToxicityColor(toxicityPercent)}
                    format={(percent) => `${percent}%`}
                />
            </div>

            <div style={{ marginBottom: 16 }}>
                <Text strong>Confidence Level</Text>
                <Progress
                    percent={confidencePercent}
                    strokeColor="#1890ff"
                    format={(percent) => `${percent}%`}
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <Text strong>Threat Categories</Text>
                <div style={{ marginTop: 8 }}>
                    <Space wrap>
                        {analysis.categories.map((category, idx) => (
                            <Tag key={idx} color="red">
                                {category.replace('_', ' ').toUpperCase()}
                            </Tag>
                        ))}
                    </Space>
                </div>
            </div>

            <div style={{ marginBottom: 12 }}>
                <Text strong>Flagged Keywords</Text>
                <div style={{ marginTop: 8 }}>
                    <Space wrap>
                        {analysis.flagged_keywords.map((keyword, idx) => (
                            <Tag key={idx} color="orange">
                                {keyword}
                            </Tag>
                        ))}
                    </Space>
                </div>
            </div>

            <div style={{ padding: 12, background: '#f0f0f0', borderRadius: 4, marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                    <CheckCircleOutlined /> {analysis.severity_justification}
                </Text>
            </div>
        </Card>
    );
};

export default AIAnalysisPanel;
