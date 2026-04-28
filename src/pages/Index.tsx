import Navbar from "@/components/grantflow/Navbar";
import Hero from "@/components/grantflow/Hero";
import Problem from "@/components/grantflow/Problem";
import HowItWorks from "@/components/grantflow/HowItWorks";
import Generator from "@/components/grantflow/Generator";
import DashboardPreview from "@/components/grantflow/DashboardPreview";
import Footer from "@/components/grantflow/Footer";
import BobChat from "@/components/grantflow/BobChat";

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Generator />
      <DashboardPreview />
      <Footer />
      <BobChat />
    </main>
  );
};

export default Index;
