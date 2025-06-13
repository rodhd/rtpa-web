"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { useSelectedLayoutSegments } from "next/navigation";

export function BackButton() {
  const segments = useSelectedLayoutSegments();
  
  // Determine if we're on a court or club page and get the back link
  let backLink = null;
  if (segments.includes("courts")) {
    // Extract clubId from the segments for court pages
    const clubId = segments[segments.indexOf("clubs") + 1];
    backLink = `/clubs/${clubId}`;
  } else if (segments.includes("clubs")) {
    backLink = "/";
  }

  if (!backLink) return null;

  return (
    <Button variant="ghost" asChild>
      <Link href={backLink} className="flex items-center gap-2">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>
    </Button>
  );
} 