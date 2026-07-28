/**
 * Socket.io singleton module.
 * Separated from server.js to avoid circular dependency
 * when controllers need to emit events.
 */
let _io = null;

export const setIO = (io) => {
  _io = io;
};

export const getIO = () => {
  if (!_io) throw new Error('Socket.io not initialized. Call setIO() first.');
  return _io;
};
