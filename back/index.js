// server.js
const express = require("express");
const net = require("net");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

/**
 * Scan a specific port
 */
const scanPort = (host, port, timeout) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);
    socket.on("connect", () => {
      resolve({ port, status: "open" });
      socket.destroy();
    });

    socket.on("timeout", () => {
      resolve({ port, status: "closed" });
      socket.destroy();
    });

    socket.on("error", () => {
      resolve({ port, status: "closed" });
    });

    socket.connect(port, host);
  });
};

/**
 * Scan a range of ports
 */
// const scanPorts = async (host, startPort, endPort, timeout) => {
//   const results = [];
//   for (let port = startPort; port <= endPort; port++) {
//     const result = await scanPort(host, port, timeout);
//     results.push(result);
//   }
//   return results;
// };

const scanPorts = async (host, startPort, endPort, timeout) => {
    const portPromises = [];
    for (let port = startPort; port <= endPort; port++) {
      portPromises.push(scanPort(host, port, timeout));
    }
    return Promise.all(portPromises);
  };

/**
 * API Endpoint for Port Scanning
 */
app.post("/scan", async (req, res) => {
  const { ip, startPort, endPort, timeout } = req.body;

  if (!ip || !startPort || !endPort) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  try {
    const results = await scanPorts(ip, parseInt(startPort), parseInt(endPort), timeout || 1000);
    res.json({ ip, results });
  } catch (error) {
    res.status(500).json({ error: "Error scanning ports" });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
