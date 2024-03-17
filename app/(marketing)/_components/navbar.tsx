import React from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-dm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size="sm" variant="outline" asChild>
            <Link href="/signin">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get Taskify for free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}