import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL: any = "http://177.200.131.54:3001";

export const socket = io(URL, {
  transports: ["websocket"],
});
