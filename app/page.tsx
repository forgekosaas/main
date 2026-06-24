import { CTAFinal } from "@/components/CTAFinal";
import { ContactFeedback } from "@/components/ContactFeedback";
import { Differentiators } from "@/components/Differentiators";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LaunchDepth } from "@/components/LaunchDepth";
import { Problem } from "@/components/Problem";
import { SaaSOperatingSystem } from "@/components/SaaSOperatingSystem";
import { SiteHeader } from "@/components/SiteHeader";
import { SocialProof } from "@/components/SocialProof";
import { Solution } from "@/components/Solution";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Differentiators />
        <SaaSOperatingSystem />
        <LaunchDepth />
        <SocialProof />
        <CTAFinal />
        <ContactFeedback />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
