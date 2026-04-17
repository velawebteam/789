import Hero from '../components/Hero';
import WhyJoin from '../components/WhyJoin';
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
import SEO from '../components/SEO';

export default function Home() {
  return (
    <main>
      <SEO 
        title="Real Builder Construction Academy | Professional Construction Courses"
        description="Premier construction academy in Portugal. Intensive, hands-on training for certified construction professionals. Join Real Builder Academy in Algarve."
        canonical="https://realbuilder-academy.com/"
      />
      <Hero />
      <WhyJoin />
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
