import { NextResponse } from "next/server";

const net = require("net");

export async function POST(request: Request) {
  const body = await request.json();
  const { ip } = body;
  await let response: string[] = [];
  // Define the Telnet server information
  const host = ip;
  const port = 23; // Default Telnet port

  // Create a TCP socket connection to the Telnet server
  const client = net.createConnection({ host, port }, () => {
    console.log("Connected to Telnet server");
    client.write("cliente\r\n");
    // Send data to the Telnet server
    //client.write("Hello, Telnet server!\r\n");
  });

  // Handle data received from the Telnet server
  await client.on("data", async (data: any) => {
    response.push(data);
    console.log("Received:", data.toString());
    if (data.includes("login:")) {
      client.write("cliente\r\n");
    }
    if (data.includes("Password:")) {
      client.write("1234\r\n");
    }
    if (data.includes("BusyBox")) {
      client.write("ethtool eth0\r\n");
      client.write("exit\r\n");
    }
  });

  // Handle connection close
  client.on("close", () => {
    console.log("Connection closed");
  });

  // Handle errors
  client.on("error", (err: any) => {
    console.error("Error:", err);
  });
  console.log(response);
  NextResponse.json({ msg: response });
}
