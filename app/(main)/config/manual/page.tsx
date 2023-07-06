//import io from "socket.io-client";
import { getOlt } from "@/actions/getOlt";
import ConfigForm from "@/components/form/ConfigForm";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import getCurrentUser from "@/actions/getCurrentUser";
import { motion, AnimatePresence } from "framer-motion";
import MotionPage from "@/lib/motionPage";

export default async function ConfigPage() {
  const currentUser = await getCurrentUser();
  const { olt } = await getOlt();
  return (
    <MotionPage>
      <div id="manualConfig" className="mx-auto w-11/12">
        <ConfigForm olt={olt} currentUser={currentUser} />
      </div>
    </MotionPage>
  );
}
