import getCurrentUser from "@/actions/getCurrentUser";
import ScriptForm from "@/components/form/ScriptForm";
import MotionPage from "@/lib/motionPage";

const script = async () => {
  const currentUser = await getCurrentUser();

  return (
    <MotionPage>
      <div className="mt-12">
        <ScriptForm currentUser={currentUser} />
      </div>
    </MotionPage>
  );
};

export default script;
