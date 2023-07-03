import getCurrentUser from "@/app/actions/getCurrentUser";
import ScriptForm from "@/app/components/form/ScriptForm";
import MotionPage from "@/app/lib/motionPage";

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
