import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CountSafe — monthly controlled-drug reconciliation",
  description: "A deterministic prototype for reconciling veterinary controlled-substance inventory and preparing an exception review."
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
