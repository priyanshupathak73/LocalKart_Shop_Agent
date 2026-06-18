/**
 * Socket.io singleton module.
 * Separated from server.js to avoid circular dependency
 * when controllers need to emit events.
 */
let _io = null;

const setIO = (io) => {
  _io = io;
};

const getIO = () => {
  if (!_io) throw new Error('Socket.io not initialized. Call setIO() first.');
  return _io;
};

module.exports = { setIO, getIO };
