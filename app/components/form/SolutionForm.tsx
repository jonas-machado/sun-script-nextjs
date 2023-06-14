"use client";

import DisclosureBank from "@/app/components/disclosure";
import { useState } from "react";
import Search from "../inputs/search";
import Modal from "../modals/Modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SolutionForm = ({ solutions }: any) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const filtered =
    query === ""
      ? solutions
      : solutions.filter((sol: any) =>
          sol.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const notify = (text: any) =>
    toast.error(text, {
      theme: "dark",
      pauseOnFocusLoss: false,
      pauseOnHover: false,
    });

  const notifySuc = (text: string) => {
    toast.success(text, {
      theme: "dark",
      pauseOnFocusLoss: false,
      hideProgressBar: false,
      pauseOnHover: false,
    });
  };

  const solutionBank = () => {
    axios
      .post("/api/solution", {
        text,
        title,
      })
      .then((callback: any) => {
        console.log(callback);
        if (callback?.error) {
          return notify(callback.error);
        } else {
          setIsOpen(false);
          setText("");
          setTitle("");
          return notifySuc(callback.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-gray-900 bg-opacity-90 p-2 flex flex-col gap-2">
        <div className="flex p-2 w-full items-center justify-between">
          <h1 className="text-2xl whitespace-nowrap text-gray-300 ">
            Banco de soluções
          </h1>
          <Search
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
          />
        </div>
        {filtered.map((sol: any) => (
          <DisclosureBank key={sol.id} title={sol.title}>
            {sol.text}
          </DisclosureBank>
        ))}
        <div className="fixed bottom-10 right-12">
          <button
            type="button"
            className="shadow-[inset_0_-2px_20px_rgba(0,0,0,0.6)] shadow-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 focus:outline-none font-bold rounded-md text-xl px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        make={solutionBank}
        cancel={() => {
          setIsOpen(false);
        }}
      >
        <div className="w-full flex flex-col gap-2">
          <input
            type="text"
            className="w-full bg-gray-900 rounded-lg outline-none p-3 text-gray-300"
            placeholder="Título"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            required
          />
          <textarea
            value={text}
            onChange={(e: any) => setText(e.target.value)}
            className="w-full min-h-[15rem] p-3 outline-none bg-gray-900 rounded-lg text-gray-300"
            required
          />
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default SolutionForm;
