"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function HeroLottie() {
  return (
    <DotLottieReact
      src="/lottie/robot-hello.lottie"
      loop
      autoplay
      style={{ width: "100%", height: "100%" }}
    />
  );
}
