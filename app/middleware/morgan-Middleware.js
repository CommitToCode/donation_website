const morgan = require("morgan");

const morganMiddleware = morgan("combined", {
  stream: {
    write: (message) => {
      console.log(message.trim());
    },
  },
});

module.exports = { morganMiddleware };