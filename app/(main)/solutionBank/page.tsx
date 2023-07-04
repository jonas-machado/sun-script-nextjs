import { getSolutions } from "@/app/actions/getSolutions";
import SolutionForm from "@/app/components/form/SolutionForm";
import MotionPage from "@/app/lib/motionPage";

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
