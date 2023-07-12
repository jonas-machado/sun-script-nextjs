//import io from "socket.io-client";
import { getOlt } from "@/actions/getOlt";
import ConfigForm from "@/components/form/ConfigForm";
import getCurrentUser from "@/actions/getCurrentUser";
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
