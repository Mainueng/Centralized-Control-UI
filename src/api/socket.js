import { SERV_WWS_API } from "../constant_config";
import socketIOClient from "socket.io-client";

const initial_socket = () => {
  return socketIOClient(SERV_WWS_API);
};

const unsubscribe = (socket) => {
  socket.disconnect();
};

const connect = (socket) => {
  socket.connect();
};

export { initial_socket, unsubscribe, connect };
