import { ContentProvider } from '../../data/ContentContext.jsx';
import ScrollProgress from '../../components/ScrollProgress/ScrollProgress.jsx';
import CursorGlow from '../../components/CursorGlow/CursorGlow.jsx';
import Nav from '../../components/Nav/Nav.jsx';
import BackToTop from '../../components/BackToTop/BackToTop.jsx';
import Hero from '../../sections/Hero/Hero.jsx';
import Stats from '../../sections/Stats/Stats.jsx';
import About from '../../sections/About/About.jsx';
import Education from '../../sections/Education/Education.jsx';
import Journey from '../../sections/Journey/Journey.jsx';
import Skills from '../../sections/Skills/Skills.jsx';
import Projects from '../../sections/Projects/Projects.jsx';
import Services from '../../sections/Services/Services.jsx';
import Contact from '../../sections/Contact/Contact.jsx';
import Footer from '../../sections/Footer/Footer.jsx';

export default function Home() {
  return (
    <ContentProvider>
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Education />
      <Journey />
      <Skills />
      <Projects />
      <Services />
      <Contact />
      <Footer />
      <BackToTop />
    </ContentProvider>
  );
}
