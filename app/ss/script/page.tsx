import getCurrentUser from "@/app/actions/getCurrentUser";
import ScriptForm from "@/app/components/form/ScriptForm";

const script = async() => {

  const currentUser = await getCurrentUser()
  return (
<div className="mt-12">
      <ScriptForm currentUser={currentUser}/>
    </div>    
  );
};

export default script;
