import { Server } from 'socket.io';

export const initializeSocket = async (server: any) => {
    const io = new Server(server,{
        pingTimeout: 60000,
        cors: {
            origin: [process.env.ORIGIN as string],
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
          socket.in(newMessageRecieved.to).emit("message recieved", newMessageRecieved);
      });

      socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData);
      });
    });
    return io;

};