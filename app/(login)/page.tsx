import LoginForm from "../components/form/LoginForm";

export default async function LoginPage() {
  return (
    <>
      <div
        className={`h-screen flex items-center justify-center bg-[url('/images/bg1.gif')] bg-no-repeat bg-fixed bg-cover`}
        id="login"
      >
        <LoginForm />
      </div>
    </>
  );
}
