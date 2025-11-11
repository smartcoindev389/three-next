"use client";
export * from "./01-hero";
export * from "./02-text";
export * from "./03-grad";
export * from "./04-services";
export * from "./05-clients";
export * from "./06-portfolio";
export * from "./07-game";
export * from "./08-cards";
import { Progress } from "@/shared/components/(main)/progress";
import { Screens } from "screens";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function Home({ homePage }: { homePage: any }) {
  return (
    <main className="page">
      <Progress />
      <Screens.ThreeScene />
      <Screens.Home.Hero hero={homePage.hero} />
      <Screens.Home.Text ambition={homePage.ambition} />
      <Screens.Home.Grad expertise={homePage.expertise} />
      <Screens.Home.Services services={homePage.service} />
      <Screens.Home.Clients clients={homePage.client} />
      <Screens.Home.Portfolio portfolio={homePage.portfolio} />
      <Screens.Home.Game
        onButtonClick={() => {
          gsap.to(".three-shake", {
            scale: 1.03,
            duration: 0.2,
            repeat: 35,
            yoyo: true,
            ease: "sine.inOut",
          });
        }}
      />
      <Screens.Home.Cards innovation={homePage.innovation} />
    </main>
  );
}
