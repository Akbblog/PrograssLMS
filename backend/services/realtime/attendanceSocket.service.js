const { Server } = require('socket.io');
let io;

module.exports = {
  init: (server) => {
    if (io) return io;
    io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
      console.log('[Socket] Attendance client connected', socket.id);

      socket.on('device:register', (data) => {
        socket.join(`device:${data.deviceId}`);
        io.emit('device:connected', data);
      });

      socket.on('disconnect', () => {
        console.log('[Socket] disconnected', socket.id);
      });
    });

    return io;
  },
  getIO: () => io
};