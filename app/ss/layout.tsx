import Navbar from "../components/navbar/Navbar";
import getCurrentUser from "../actions/getCurrentUser";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <section className="bg-[url('/images/backgroundConfig.gif')] bg-no-repeat bg-auto h-screen">
      <Navbar currentUser={currentUser} />
      {children}
    </section>
  );
}
