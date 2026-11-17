import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { Sparkles, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-32 px-4 text-center max-w-lg mx-auto bg-[#FFF8F3]">
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C5A059] mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Page Not Found</span>
      </div>
      <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#521225] mb-4">
        404
      </h1>
      <p className="text-sm text-[#8A7B78] mb-8 leading-relaxed">
        The exquisite weave you are looking for may have moved or is no longer available. Please explore our curated collections or return to the homepage.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/">
          <Button variant="primary" size="md" icon={Home}>
            Return Home
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="outline" size="md">
            Browse All Sarees
          </Button>
        </Link>
      </div>
    </div>
  );
}
