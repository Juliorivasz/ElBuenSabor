import { HeroSection } from "../../components/home/HeroSection";
import { FloatingElements } from "../../components/home/FloatingElements";

export const Home = () => {
  return (
    <div className="relative">
      <HeroSection />
      <FloatingElements />
    </div>
  );
};
