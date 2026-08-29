import SiteHeader from "@/components/landing/SiteHeader";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Examples from "@/components/landing/Examples";
import EngineShowcase from "@/components/landing/EngineShowcase";
import DecisionSimDemo from "@/components/landing/DecisionSimDemo";
import RoleplayDemo from "@/components/landing/RoleplayDemo";
import ScamSenseDemo from "@/components/landing/ScamSenseDemo";
import ThemesShowcase from "@/components/landing/ThemesShowcase";
import FinalCTA from "@/components/landing/FinalCTA";
import SiteFooter from "@/components/landing/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Examples />
        <EngineShowcase />
        <DecisionSimDemo />
        <RoleplayDemo />
        <ScamSenseDemo />
        <ThemesShowcase />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
