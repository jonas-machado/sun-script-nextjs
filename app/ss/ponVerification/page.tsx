import React from "react";
import { getOlt } from "@/app/actions/getOlt";
import PonVerificationForm from "@/app/components/form/PonVerificationForm";

const ponVerification = async () => {
  const { oltZteChimaData, oltIntelbrasData, oltDatacomData } = await getOlt();

  return (
    <div className="mt-14">
      <PonVerificationForm
        oltZteChimaData={oltZteChimaData}
        oltIntelbrasData={oltIntelbrasData}
        oltDatacomData={oltDatacomData}
      />
    </div>
  );
};

export default ponVerification;
