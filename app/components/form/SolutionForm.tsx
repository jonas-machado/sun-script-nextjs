"use client";

import DisclosureBank from "@/app/components/disclosure";
import { useState } from "react";
import Search from "../inputs/search";

const SolutionForm = ({ solutions }: any) => {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? solutions
      : solutions.filter((sol: any) =>
          sol.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl bg-gray-700 bg-opacity-90 p-2 flex flex-col gap-2">
      <div className="flex p-2 w-full items-center justify-between">
        <h1 className="text-2xl whitespace-nowrap text-gray-300 ">
          Banco de soluções
        </h1>
        <Search value={query} onChange={(e: any) => setQuery(e.target.value)} />
      </div>
      {filtered.map((sol: any) => (
        <DisclosureBank key={sol.id} title={sol.title}>
          {sol.text}
        </DisclosureBank>
      ))}
    </div>
  );
};

export default SolutionForm;
