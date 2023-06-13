import { getSolutions } from "@/app/actions/getSolutions";
import SolutionForm from "@/app/components/form/SolutionForm";

const SolutionBank = async () => {
  const solutions = await getSolutions();
  return (
    <div className="w-full px-4 pt-16">
      <SolutionForm solutions={solutions} />
    </div>
  );
};

export default SolutionBank;
