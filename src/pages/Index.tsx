import { Helmet } from "react-helmet-async";
import Navbar from "@/components/grantflow/Navbar";
import Hero from "@/components/grantflow/Hero";
import Problem from "@/components/grantflow/Problem";
import HowItWorks from "@/components/grantflow/HowItWorks";
import Generator from "@/components/grantflow/Generator";
import DashboardPreview from "@/components/grantflow/DashboardPreview";
import Footer from "@/components/grantflow/Footer";
import BobChat from "@/components/grantflow/BobChat";
import GlassShapes from "@/components/grantflow/GlassShapes";
import WaitlistPopup from "@/components/grantflow/WaitlistPopup";

const Bridge = ({ delay = "0s" }: { delay?: string }) => (
  <div className="relative h-24 md:h-32 -my-12 md:-my-16 overflow-visible">
    <GlassShapes variant="transition" className="" />
    <span className="sr-only" style={{ animationDelay: delay }} />
  </div>
);

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <Hero />
      <Bridge />
      <Problem />
      <Bridge delay="-3s" />
      <HowItWorks />
      <Bridge delay="-6s" />
      <Generator />
      <Bridge delay="-9s" />
      <DashboardPreview />
      <Footer />
      <BobChat />
      <WaitlistPopup />
    </main>
  );
};

export default Index;
