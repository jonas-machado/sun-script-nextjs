const net = require('net');

// Define the Telnet server information
const host = 'your-telnet-server-hostname';
const port = 23; // Default Telnet port

// Create a TCP socket connection to the Telnet server
const client = net.createConnection({ host, port }, () => {
  console.log('Connected to Telnet server');

  // Send data to the Telnet server
  client.write('Hello, Telnet server!\r\n');
});

// Handle data received from the Telnet server
client.on('data', (data: any) => {
  console.log('Received:', data.toString());
});

// Handle connection close
client.on('close', () => {
  console.log('Connection closed');
});

// Handle errors
client.on('error',( err: any) => {
  console.error('Error:', err);
});
