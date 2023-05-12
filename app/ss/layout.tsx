import Navbar from "../components/navbar/Navbar";
import getCurrentUser from "../actions/getCurrentUser";
import PageWrapper from "../lib/pageWrapper";
import NextTopLoader from 'nextjs-toploader';


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <>
      <PageWrapper>
        <section className="bg-[url('/images/backgroundConfig.gif')] bg-no-repeat bg-auto h-screen">
          <Navbar currentUser={currentUser} />
          <NextTopLoader
            color="#000000"
            shadow="0 0 70px #ffffff,0 0 70px #ffffff"
            showSpinner={false}

          />
          {children}
        </section>
      </PageWrapper>
    </>
  );
}
