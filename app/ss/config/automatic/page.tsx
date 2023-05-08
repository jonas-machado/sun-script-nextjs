import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
//import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const automatic = (props: any) => {
  // const [server, setServer] = useState();
  // const [comando, setComando] = useState();
  // const [cmd, setCmd] = useState("");

  // const cli: any = useRef();
  // const command: any = useRef();

  // useEffect(() => {
  //   cli.current.scrollTop = cli.current.scrollHeight;
  // });

  // const handleClickConnect = () => {
  //   socket.emit("sendServer", {
  //     server: server,
  //   });
  // };

  // const handleComand = async (e: any) => {
  //   setComando(e.target.value);
  //   if (e.key === "Enter") {
  //     console.log(comando);
  //     console.log(server);
  //     socket.emit("sendCommand", {
  //       comando: comando,
  //       server: server,
  //     });
  //     command.current.value = "";
  //   }
  // };

  // useEffect(() => {
  //   socket.removeAllListeners();
  //   socket.on("forCli", (res: any) => {
  //     console.log(res);
  //     setCmd((prev) => {
  //       return prev + res;
  //     });
  //   });
  // }, [socket]);

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
              className="outline-0 bg-black opacity-80 block w-full flex-1 rounded-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white pl-2"
            />
            <div className="">
              <button
                className="p-2 outline-0 bg-gray-900 opacity-80 block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white pl-2"
              >
                Conectar
              </button>
              <button className="p-2 outline-0 bg-gray-900 opacity-80 block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white pl-2">
                desconectar
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mt-1 flex">
              <textarea
                disabled
                rows={10}
                className="opacity-80 shadow-md bg-black rounded-xl mt-1 block w-full text-white p-5"
              />
            </div>
            <div className="mt-1 flex shadow-lg">
              <span className="p-2 inline-flex items-center rounded-l-md border border-black opacity-80 bg-gray-900 px-3 text-sm text-white">
                Código
              </span>
              <input
                type="text"
                name="company-website"
                id="company-website"
                className="outline-0 bg-black opacity-80 block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white pl-2"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};


export default automatic;
