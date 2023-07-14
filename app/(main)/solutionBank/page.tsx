import { getSolutions } from "@/lib/actions/getSolutions";
import SolutionForm from "@/components/form/SolutionForm";
import MotionPage from "@/lib/motionPage";

const SolutionBank = async () => {
  const solutions = await getSolutions();
  return (
    <MotionPage>
      <div className="w-full px-4 pt-16">
        <SolutionForm solutions={solutions} />
      </div>
    </MotionPage>
  );
};

export default SolutionBank;
