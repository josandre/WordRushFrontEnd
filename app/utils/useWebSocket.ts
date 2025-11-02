import { useEffect, useState } from "react";
import webSocketService from "../services/webSocketService";

interface WebSocketMessage {
    type: string;
    [key: string]: any;
}

interface UseWebSocketReturn<T> {
    messages: T[];
    isConnected: boolean;
    sendMessage: (data: Omit<T, "type">) => boolean;
}

export function useWebSocket<T extends WebSocketMessage>(messageType: string): UseWebSocketReturn<T> {
    const [messages, setMessages] = useState<T[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>((webSocketService as any).isConnected ?? false);

    useEffect(() => {
        // Connect to web socket (internally will make sure only one connection is handled)
        webSocketService.connect();

        // Handlers
        const messageCallback = (data: T) => {
            setMessages((prev) => [...prev, data]);
        };

        const connectCallback = () => {
            setIsConnected(true);
        };

        const disconnectCallback = () => {
            setIsConnected(false);
        };

        // Subscribe to webSocket events
        webSocketService.addCallbacks(messageType, messageCallback);
        webSocketService.setupConnectionCallbacks(connectCallback, disconnectCallback);

        // Cleanup
        return () => {
            webSocketService.removeCallbacks(messageType, messageCallback);
            webSocketService.clearConnectionCallbacks(connectCallback, disconnectCallback);
        };
    }, [messageType]);

    const sendMessage = (data: Omit<T, "type">): boolean => {
        return webSocketService.sendMessage({
            type: messageType,
            ...data,
        });
    }

    return {
        messages,
        isConnected,
        sendMessage
    }
}