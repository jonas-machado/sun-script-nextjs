import Navbar from "../components/navbar/Navbar";
import getCurrentUser from "../actions/getCurrentUser";
import PageWrapper from "../lib/pageWrapper";
import NextTopLoader from "nextjs-toploader";
import { getSchedule } from "../actions/getSchedule";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const schedules = await getSchedule();

  return (
    <>
      <PageWrapper>
        <section className="bg-[url('/images/backgroundConfig.gif')] bg-no-repeat bg-auto h-screen">
          <Navbar currentUser={currentUser} schedules={schedules} />
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
