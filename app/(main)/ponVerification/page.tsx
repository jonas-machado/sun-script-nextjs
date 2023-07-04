import React from "react";
import { getOlt } from "@/app/actions/getOlt";
import PonVerificationForm from "@/app/components/form/PonVerificationForm";

const ponVerification = async () => {
  const { olt } = await getOlt();

  return (
    <div className="mt-14">
      <PonVerificationForm olt={olt} />
    </div>
  );
};

export default ponVerification;
