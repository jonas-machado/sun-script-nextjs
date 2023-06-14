//import io from "socket.io-client";
import { getOlt } from "@/app/actions/getOlt";
import ConfigForm from "@/app/components/form/ConfigForm";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import getCurrentUser from "../../../actions/getCurrentUser";
import { motion, AnimatePresence } from "framer-motion";
import MotionPage from "@/app/lib/motionPage";

export default async function ConfigPage() {
  const currentUser = await getCurrentUser();
  const { oltZteChimaData, oltIntelbrasData, oltDatacomData } = await getOlt();
  return (
    <MotionPage>
      <div id="config" className="mx-auto w-11/12">
        <ConfigForm
          oltZteChimaData={oltZteChimaData}
          oltIntelbrasData={oltIntelbrasData}
          oltDatacomData={oltDatacomData}
          currentUser={currentUser}
        />
      </div>
    </MotionPage>
  );
}
