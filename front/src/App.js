// App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [ip, setIp] = useState("");
  const [startPort, setStartPort] = useState("");
  const [endPort, setEndPort] = useState("");
  const [timeout, setTimeoutValue] = useState(1000);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setResults([]);
    try {
      const response = await axios.post("http://localhost:8080/scan", {
        ip,
        startPort,
        endPort,
        timeout,
      });
      setResults(response.data.results);
    } catch (error) {
      alert("Error scanning ports: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Port Scanner</h1>
      <div>
        <input
          type="text"
          placeholder="IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
        <input
          type="number"
          placeholder="Start Port"
          value={startPort}
          onChange={(e) => setStartPort(e.target.value)}
        />
        <input
          type="number"
          placeholder="End Port"
          value={endPort}
          onChange={(e) => setEndPort(e.target.value)}
        />
        <input
          type="number"
          placeholder="Timeout (ms)"
          value={timeout}
          onChange={(e) => setTimeoutValue(e.target.value)}
        />
        <button onClick={handleScan} disabled={loading}>
          {loading ? "Scanning..." : "Start Scan"}
        </button>
      </div>

      <h2>Scan Results</h2>
      {results.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Port</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.port}</td>
                <td>{result.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results to display</p>
      )}
    </div>
  );
}

export default App;










// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
