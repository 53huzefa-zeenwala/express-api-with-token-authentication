const { createClient } = require("redis");
const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("connect", () => {
  console.log("Client Connecting to REDIS...");
});

client.on("ready", () => {
  console.log("Client Connected to REDIS");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", (err) => {
  console.log("Client Disconnected to REDIS");
});

client.connect();

process.on("SIGINT", () => {
  client.disconnect();
});

module.exports = client;
