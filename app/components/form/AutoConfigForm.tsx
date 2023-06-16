"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import io from "socket.io-client";

const AutoConfigForm = () => {
  const [server, setServer] = useState("");
  const [cmd, setCmd] = useState("");

  const cli: any = useRef();
  const command: any = useRef();

  useEffect(() => {
    cli.current.scrollTop = cli.current.scrollHeight;
  });

  const handleClickConnect = (ip: string) => {
    const socket = io("http://localhost:3001");

    // Handle connection event
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    // Handle disconnection event
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Handle "chat message" event
    socket.on("telnet response", (response) => {
      console.log("Received response:", response);
      setCmd(response);
      // Do something with the received data in the frontend
    });

    // Send a message to the server
    socket.emit("connectTelnet", ip);

    // Disconnect from the server
    return () => {
      socket.disconnect();
    };
  };

  return (
    <>
      <div className="mx-auto mt-16 w-11/12">
        <section>
          <div className="mt-1 flex shadow-lg">
            <span className="inline-flex items-center rounded-l-md border border-black opacity-80 bg-gray-900 px-3 text-sm text-white">
              Server
            </span>
            <input
              type="text"
              name="company-website"
              id="company-website"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="outline-0 bg-black opacity-80 block w-full flex-1 rounded-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white pl-2"
            />
            <div className="">
              <button
                onClick={() => handleClickConnect(server)}
                className="p-2 outline-0 bg-gray-900 opacity-80 block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white pl-2"
              >
                Conectar
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mt-1 flex">
              <textarea
                value={cmd}
                disabled
                ref={cli}
                rows={10}
                className="opacity-80 shadow-md bg-black rounded-xl mt-1 block w-full text-white p-5"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AutoConfigForm;
