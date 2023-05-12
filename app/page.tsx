import LoginForm from "./components/form/LoginForm";
import getCurrentUser from "./actions/getCurrentUser";



export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  return (
    <>
      <div
        className={`h-screen flex items-center justify-center bg-[url('/images/bg1.gif')] bg-no-repeat bg-fixed bg-cover`}

      >
        <LoginForm currentUser={currentUser} />
      </div>
    </>
  );
}
