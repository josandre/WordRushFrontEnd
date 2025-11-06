import { isWeb } from "@/app/utils/envDetails";
import { AppState } from "react-native";

type Callback<T = any> = (data: T) => void;
interface MessageData {
    type: string;
    [key: string]: any;
}

const WEB_SOCKET_URL: string = (isWeb) 
    ? "ws://127.0.0.1:5178/ws"
    : "ws://10.0.2.2:5178/ws";

const CONNECT_MESSAGE_TYPE: string = "connect";
const DISCONNECT_MESSAGE_TYPE: string = "disconnect";

// Service used to handle the application web socket logic
// It can send and receive messages from the server
class WebSocketService {
    
    private static instance: WebSocketService | null = null;

    private socketRef: WebSocket | null = null;
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;

    private callbacks: Record<string, Callback[]> = {};
    private timeout?: ReturnType<typeof setTimeout>;

    private constructor() {
        // Handle app foreground/background transitions
        AppState.addEventListener("change", (state) => {
            if (state === "active" && !this.isConnected) {
                console.log("App resumed, reconnecting WebSocket");
                this.connect();
            }
        });
    }

    static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }

        return WebSocketService.instance;
    }

    
    // Creates the connection to the WebSocket
    public connect(): void {
        // Clear active callbacks, just for safety, prevent calling duplicate functions or something strange
        // A simple callback per message
        this.callbacks = {};

        if (this.socketRef && this.isConnected) return;

        this.socketRef = new WebSocket(WEB_SOCKET_URL);

        // Open callback
        this.socketRef.onopen = () => {
            //console.log("WebSocket is connected");

            this.isConnected = true;
            this.reconnectAttempts = 0;

            this.executeCallback(CONNECT_MESSAGE_TYPE, null);
        };

        // Message received callback
        this.socketRef.onmessage = (event: MessageEvent) => {
            try {
                const data: MessageData = JSON.parse(event.data);
                this.executeCallback(data.Type, data);
            } catch (error) {
                console.error("Error parsing WebSocket message: ", error);
            }
        }

        // Error callback
        this.socketRef.onerror = (event: Event) => {
            //console.error("WebSocket error: ", event);

            this.executeCallback("error", event);
        };

        // Close callback
        this.socketRef.onclose = (event: CloseEvent) => {
            //console.log("WebSocket closed: ", event.code, event.reason);
            
            this.isConnected = false;
            this.socketRef = null;

            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                // Exponential backoff for reconnection
                const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
                this.timeout = setTimeout(() => {
                    this.reconnectAttempts++;
                    this.connect();
                }, delay);
            }
        };
    }

    //
    public disconnect(): void {
        if (this.socketRef) {
            this.socketRef.close();
            this.socketRef = null;
            this.isConnected = false;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }
        }
    }

    //
    public sendMessage(data: object): boolean {
        if (this.socketRef && this.isConnected) {
            console.log(data);
            console.log("[WEBSOCKET] - Sending message: ", JSON.stringify(data))
            this.socketRef.send(JSON.stringify(data));
            return true;
        }

        return false;
    }

    // Helper function to connect the "connection" callbacks in a single call
    public setupConnectionCallbacks(connectCallback: Callback, disconnectCallback: Callback): void {
        this.addCallbacks(CONNECT_MESSAGE_TYPE, connectCallback);
        this.addCallbacks(DISCONNECT_MESSAGE_TYPE, disconnectCallback);
    }

    // Helper function to disconnect the "connection" callbacks in a single call
    public clearConnectionCallbacks(connectCallback: Callback, disconnectCallback: Callback): void {
        this.removeCallbacks(CONNECT_MESSAGE_TYPE, connectCallback);
        this.removeCallbacks(DISCONNECT_MESSAGE_TYPE, disconnectCallback);
    }

    // Used to subscribe to the WebSocket messages
    public addCallbacks(messageType: string, callback: Callback): void {
        if (!this.callbacks[messageType]) {
            this.callbacks[messageType] = [];
        }
        
        this.callbacks[messageType] = [callback];

        console.log("[WEBSOCKET] - Adding callback: ", messageType, this.callbacks);
    }

    // Used to unsubscribe from the WebSocket messages
    public removeCallbacks(messageType: string, callback: Callback): void {
        if (this.callbacks[messageType]) {
            this.callbacks[messageType] = this.callbacks[messageType].filter(
                (cb) => cb !== callback    
            );
        }

        console.log("[WEBSOCKET] - Removing callback: ", messageType, this.callbacks);
    }

    // Called every time a WebSocket message is received
    // This function checks the type of every subscribed callback, so it notifies only the required functions
    private executeCallback(messageType: string, data: any): void {
        console.log("[WEB SOCKET] - Executing callback: ", messageType, data);

        if (this.callbacks[messageType]) {
            this.callbacks[messageType].forEach((callback) => callback(data));
        }
    }
}

export default WebSocketService.getInstance();