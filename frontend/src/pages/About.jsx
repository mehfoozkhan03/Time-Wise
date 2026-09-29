import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "../styles/About.css";
import AboutHero from "../components/About/AboutHero/AboutHero";
import Mission from "../components/About/Mission/Mission";
import Team from "../components/About/Team/Team";
import Testimonials from "../components/About/Testimonials/Testimonials";
import CoreValues from "../components/About/CoreValues/CoreValues";
import CTA from "../components/About/CTA/CTA";
import AboutSkeleton from "../components/About/Skeleton/AboutSkeleton";

function About() {
//   const { isLoading } = useSelector();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <AboutSkeleton />;

  return (
    <>
      <AboutHero />

      <Mission />

      <Team />

      <Testimonials />

      <CoreValues />

      <CTA />
    </>
  );
}

export default About;
