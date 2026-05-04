import Header from "@/assets/component/Header";
import { Geist, Geist_Mono } from "next/font/google";

// import "./globals.css";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Header />
      <div className="h-full">
        {children}
      </div>
    </>
  );
}
