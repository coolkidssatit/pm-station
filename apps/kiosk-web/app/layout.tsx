import { Prompt } from "next/font/google";
import { Metadata } from "next";
import "react-toastify/dist/ReactToastify.min.css";
import "../styles/globals.css";
import "../styles/pm-station.css";

const promptFont = Prompt({
  variable: "--font-prompt",
  weight: ["400", "500", "600"],
  subsets: ["latin", "thai"],
  display: "block",
});

export const metadata: Metadata = {
  title: {
    default: "PM Station Kiosk",
    template: "%s | PM Station Kiosk",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={promptFont.variable}>
      <head />
      <body>{children}</body>
    </html>
  );
}
