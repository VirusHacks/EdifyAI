'use client'

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className=" text-2xl uppercase md:text-2xl">
          Welcome to Edify
        </p>

        <AnimatedTitle
          title="Pe<b>r</b>son<b>a</b>lize<b>d</b> Le<b>a</b>r<b>n</b>i<b>n</b>g, E<b>m</b>po<b>w</b>ere<b>d</b> Careers,</br> Co<b>n</b><b>n</b>ecte<b>d</b> Co<b>m</b><b>m</b>n<b>i</b>ties."
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext !text-2xl">
          <p>Edify AI stands as your personalized guide through the maze of education</p>
          <p className="text-gray-500">
          Whether you're a beginner or a professional, Edify AI is your partner in mastering new skills, 
          building networks, and stepping into the future.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="https://images.stockcake.com/public/8/f/f/8ffe74fd-c897-4c83-b9d4-9c46abb269f6_large/vr-classroom-experience-stockcake.jpg"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;

