"use client";

import dynamic from "next/dynamic";

const HeroLottie = dynamic(() => import("./HeroLottie"), {
  ssr: false,
  loading: () => null,
});

export default function HeroLottieLoader() {
  return <HeroLottie />;
}
