import React from 'react';
import { Platform } from '../types';
import {
    TwitterOutlined,
    InstagramOutlined,
    VideoCameraOutlined,
    MailOutlined,
    GlobalOutlined
} from '@ant-design/icons';

interface PlatformIconProps {
    platform: Platform;
    size?: number;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 24 }) => {
    const iconStyle = { fontSize: size };

    switch (platform) {
        case 'twitter':
            return <TwitterOutlined style={{ ...iconStyle, color: '#1DA1F2' }} />;
        case 'instagram':
            return <InstagramOutlined style={{ ...iconStyle, color: '#E1306C' }} />;
        case 'tiktok':
            return <VideoCameraOutlined style={{ ...iconStyle, color: '#000000' }} />;
        case 'email':
            return <MailOutlined style={{ ...iconStyle, color: '#EA4335' }} />;
        case 'web':
            return <GlobalOutlined style={{ ...iconStyle, color: '#666' }} />;
        default:
            return <GlobalOutlined style={iconStyle} />;
    }
};

export default PlatformIcon;
