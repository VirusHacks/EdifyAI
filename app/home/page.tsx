import Header from "../(course)/_components/Header";
import Hero from "../(course)/_components/Hero";
import DotPattern from "@/components/ui/dot-pattern";
import { ny } from "@/lib/utils";
import { HowItWorks } from "../(course)/_components/HowItWorks";
import { AICourseText } from "../(course)/_components/AICourseText";

export default function Home() {
  return (
    <div>
      <div>
        <Header />
        <Hero />
        <AICourseText />
        <HowItWorks />
      </div>
      <DotPattern
        className={ny(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  );
}
