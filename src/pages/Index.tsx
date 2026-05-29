import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Resources } from "@/components/sections/Resources";
import { Priorities } from "@/components/sections/Priorities";
import { Team } from "@/components/sections/Team";
import { Issues } from "@/components/sections/Issues";
import { Appointment } from "@/components/sections/Appointment";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

const Index = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <About />
    <Resources />
    <Priorities />
    <Team />
    <Issues />
    <Appointment />
    <Contact />
    <Footer />
  </main>
);

export default Index;
