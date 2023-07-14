import getCurrentUser from "@/lib/actions/getCurrentUser";
import ScriptForm from "@/components/form/ScriptForm";
import MotionPage from "@/lib/motionPage";

const script = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="mt-12">
      <ScriptForm currentUser={currentUser} />
    </div>
  );
};

export default script;
