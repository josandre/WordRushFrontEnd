let _socket: WebSocket | null = null;
let _userId: string | null = null;

export const SocketStore = {
  setSocket(socket: WebSocket) {
    _socket = socket;
  },
  getSocket() {
    return _socket;
  },
  clearSocket() {
    _socket = null;
  },
  setUserId(id: string) {
    _userId = id;
  },
  getUserId() {
    return _userId;
  },
  clearUserId() {
    _userId = null;
  },
};
