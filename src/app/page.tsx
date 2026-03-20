import HeroSection from "@/components/sections/HeroSection";
import ServicesOverview from "@/components/sections/ServicesOverview";
import WhyNexxVantage from "@/components/sections/WhyNexxVantage";
import CTABanner from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="nv-divider" />
      <ServicesOverview />
      <div className="nv-divider" />
      <WhyNexxVantage />
      <div className="nv-divider" />
      <CTABanner />
    </>
  );
}
