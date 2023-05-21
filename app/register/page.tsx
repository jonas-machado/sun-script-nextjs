import RegisterForm from "../components/form/RegisterForm";
import { motion } from "framer-motion";
import PageWrapper from "../lib/pageWrapper";

function RegisterPage() {
  return (
    <>

      <div
        id="register"
        className={`h-screen flex items-center justify-center bg-[url('/images/bg1.gif')] bg-no-repeat bg-fixed bg-cover`}

      >
        <RegisterForm />
      </div>

    </>
  );
}

export default RegisterPage;
