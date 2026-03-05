import dynamic from "next/dynamic";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ScrollTriggerRefresh from "@/components/ScrollTriggerRefresh";
import ScrollProgress from "@/components/ScrollProgress";

// Dynamic imports for below-fold sections (bundle-dynamic-imports)
// These are not visible on initial viewport, so lazy loading reduces initial bundle
const Projects = dynamic(() => import("@/components/Projects"));
const Skills = dynamic(() => import("@/components/Skills"));
const Timeline = dynamic(() => import("@/components/Timeline"));
const Collaboration = dynamic(() => import("@/components/Collaboration"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <CustomCursor />
      <SmoothScroll>
        <Header />
        <main>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Timeline />
          <Collaboration />
        </main>
        <Footer />
      </SmoothScroll>
      <ScrollTriggerRefresh />
    </>
  );
}
