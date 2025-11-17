import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../../assets/fonts/PretendardVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

export const kccHanbit = localFont({
  src: [
    {
      path: "../../assets/fonts/KCC-Hanbit.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-kcc-hanbit",
  display: "swap",
  preload: true,
});