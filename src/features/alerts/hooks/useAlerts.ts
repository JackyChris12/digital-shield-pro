import { useQuery } from '@tanstack/react-query';
import { Alert } from '../types';
import platformAlerts from '../data/platformAlerts';

// Simulate API call with network latency
const fetchAlerts = async (): Promise<Alert[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(platformAlerts);
        }, 800); // Simulate network delay
    });
};

export const useAlerts = () => {
    return useQuery({
        queryKey: ['alerts'],
        queryFn: fetchAlerts,
        staleTime: 30000, // 30 seconds
        refetchInterval: 10000, // Refetch every 10 seconds for "real-time" feel
    });
};

// Placeholder for real-time WebSocket hook (Phase 2)
export const useRealTimeAlerts = () => {
    // TO DO: Implement WebSocket connection
    // Will simulate new alerts streaming in
    return null;
};
