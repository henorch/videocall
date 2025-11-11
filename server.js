const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT || 5000

const app = express();
const server = http.createServer(app);
const io = require("socket.io")({
  cors: { origin: "*" },
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", (data) => {
    socket.to(data.to).emit("offer", { sdp: data.sdp, from: data.from });
  });

  socket.on("answer", (data) => {
    socket.to(data.to).emit("answer", { sdp: data.sdp, from: data.from });
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.to).emit("ice-candidate", data.candidate);
  });
});

app.listen(port, () =>{
   console.log("server is working on port" + port);
   
})