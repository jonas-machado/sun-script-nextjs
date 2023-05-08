import RegisterForm from "../components/form/RegisterForm";

function RegisterPage() {
  return (
    <>
      <div
        className={`h-screen flex items-center justify-center bg-[url('/images/bg1.gif')] bg-no-repeat bg-fixed bg-cover`}
      >
        <RegisterForm />
      </div>
    </>
  );
}

export default RegisterPage;
