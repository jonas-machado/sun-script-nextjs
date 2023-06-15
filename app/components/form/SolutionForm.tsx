"use client";

import DisclosureBank from "@/app/components/disclosure";
import { useState, useEffect } from "react";
import Search from "../inputs/search";
import Modal from "../modals/Modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TabBody from "../tab/TabBody";
import TabHead from "../tab/TabHead";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

//constants
import { tabSolution } from "@/app/constants/tabSolutions";

const SolutionForm = ({ solutions }: any) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [openTab, setOpenTab] = useState("Adicionar");
  const [solutionsArray, setSolutionsArray] = useState([]);

  useEffect(() => {
    setSolutionsArray(solutions);
  }, [solutions]);

  const filtered =
    query === ""
      ? solutionsArray
      : solutionsArray.filter((sol: any) =>
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

  const router = useRouter();

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
          router.refresh();
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

  const excluir = (id: string) => {
    axios
      .post("/api/solutionExclude", {
        id,
      })
      .then((callback: any) => {
        console.log(callback);
        router.refresh();
        if (callback?.error) {
          return notify(callback.error);
        } else {
          return notifySuc(callback.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-black bg-opacity-95 p-3 flex flex-col gap-2">
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
            className="shadow-[inset_0_-2px_20px_rgba(0,0,0,0.6)] shadow-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 focus:outline-none font-bold rounded-md text-xl px-5 py-2.5 text-center mr-2 mb-2"
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
        <div className="mb-4">
          <TabBody>
            {tabSolution.map((tab) => (
              <TabHead
                key={tab}
                state={openTab}
                id={tab}
                onClick={() => setOpenTab(tab)}
              >
                {tab}
              </TabHead>
            ))}
          </TabBody>
        </div>
        {openTab == "Adicionar" && (
          <div className="w-full flex flex-col gap-2">
            <input
              type="text"
              className="w-full bg-gray-800 bg-opacity-70 rounded-lg outline-none p-3 text-gray-300"
              placeholder="Título"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
              required
            />
            <textarea
              value={text}
              onChange={(e: any) => setText(e.target.value)}
              className="w-full min-h-[15rem] p-3 outline-none bg-gray-800 bg-opacity-70 rounded-lg text-gray-300"
              required
            />
          </div>
        )}
        {openTab == "Listagem" && (
          <div className="relative overflow-x-auto">
            <table className="w-full bg-gray-800 bg-opacity-80 text-sm text-left text-gray-300 dark:text-gray-400">
              <thead className="text-xs text-gray-300 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Título
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Texto
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Excluir
                  </th>
                </tr>
              </thead>
              <tbody>
                {solutionsArray.map((sol: any) => (
                  <tr
                    className="bg-gray-900 bg-opacity-60 border-b"
                    key={sol.id}
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-300 dark:text-white"
                    >
                      {sol.title}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-pre-line text-gray-300 dark:text-white"
                    >
                      {sol.text}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-pre-line text-red-600"
                    >
                      <XMarkIcon
                        className="cursor-pointer"
                        onClick={() => excluir(sol.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
      <ToastContainer />
    </>
  );
};

export default SolutionForm;
