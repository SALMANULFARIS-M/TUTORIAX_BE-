"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const initializeSocket = async (server) => {
    const io = new socket_io_1.Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: [process.env.ORIGIN],
        },
    });
    io.on("connection", (socket) => {
        socket.on("setup", (userData) => {
            socket.join(userData);
            socket.emit("connected");
        });
        socket.on("join chat", (room) => {
            socket.join(room);
            // console.log("user joined Romm :" + room)
        });
        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
        socket.on("new message", (newMessageRecieved) => {
            console.log(newMessageRecieved);
            socket.in(newMessageRecieved.to).emit("message recieved", newMessageRecieved);
        });
        socket.off("setup", (userData) => {
            console.log("USER DISCONNECTED");
            socket.leave(userData);
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
