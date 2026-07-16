import HeroMovement from "@/components/sections/HeroMovement";
import Manifesto from "@/components/sections/Manifesto";
import TwoCrafts from "@/components/sections/TwoCrafts";
import WorkGallery from "@/components/sections/WorkGallery";
import MethodCTA from "@/components/sections/MethodCTA";
import WhyUs from "@/components/sections/WhyUs";

export default function HomePage() {
  return (
    <>
      <HeroMovement />
      <Manifesto />
      <div className="nv-divider" />
      <TwoCrafts />
      <WorkGallery />
      <WhyUs />
      <MethodCTA />
    </>
  );
}
