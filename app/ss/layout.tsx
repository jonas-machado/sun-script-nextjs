import Navbar from "../components/navbar/Navbar";
import getCurrentUser from "../actions/getCurrentUser";
import PageWrapper from "../lib/pageWrapper";
import NextTopLoader from "nextjs-toploader";
import { getSchedule } from "../actions/getSchedule";
import MotionPage from "../lib/motionPage";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const schedules = await getSchedule();

  return (
    <PageWrapper>
      <MotionPage>
        <div className="bg-[url('/images/backgroundConfig.gif')] bg-black bg-no-repeat bg-cover h-full min-h-screen">
          <Navbar currentUser={currentUser} schedules={schedules} />
          <NextTopLoader
            color="#000000"
            shadow="0 40px 50px #ffffff,0 40px 50px #ffffff"
            showSpinner={false}
          />
          {children}
        </div>
      </MotionPage>
    </PageWrapper>
  );
}
