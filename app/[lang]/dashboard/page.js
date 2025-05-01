import DashboardPageView from "./DashboardPageView";
import { TranslationProvider } from "@/provider/TranslationProvider";
const Dashboard = async ({ params: { lang } }) => {
  return (
    <TranslationProvider locale={lang}>
      <DashboardPageView />
    </TranslationProvider>
  );
};

export default Dashboard;
