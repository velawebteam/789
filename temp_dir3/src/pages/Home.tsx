import Hero from '../components/Hero';
import PilotProgram from '../components/PilotProgram';
import AboutUs from '../components/AboutUs';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import MobilitySolutions from '../components/MobilitySolutions';
import Courses from '../components/Courses';
import NextCourses from '../components/NextCourses';
import Professionals from '../components/Professionals';
import Partners from '../components/Partners';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <PilotProgram />
      <AboutUs />
      <HowItWorks />
      <Pricing />
      <MobilitySolutions />
      <Courses />
      <NextCourses />
      <Professionals />
      <Partners />
      <Contact />
    </main>
  );
}
