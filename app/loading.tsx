import React from "react";
import { PacmanLoader } from "react-spinners";

function Loading() {
  return (
    <div>
      teste
      <PacmanLoader loading={true} color="green" />
    </div>
  );
}

export default Loading;
