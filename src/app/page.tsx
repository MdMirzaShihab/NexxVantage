import HeroSection from "@/components/sections/HeroSection";
import ServicesOverview from "@/components/sections/ServicesOverview";
import WhyNexxVantage from "@/components/sections/WhyNexxVantage";
import CTABanner from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <WhyNexxVantage />
      <CTABanner />
    </>
  );
}
