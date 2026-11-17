import React, { useState } from "react";
import Button from "../common/Button";
import { Mail, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSubscribed(true);
    toast.success("Welcome to the Harini heritage family ✨", {
      style: {
        background: "#521225",
        color: "#FFF8F3",
        border: "1px solid #C5A059",
      },
    });
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F4DCD6]/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#7B1E3A] text-[#C5A059] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#380C19] mb-3">
          Join the Royal Heritage Circle
        </h2>

        <p className="text-xs sm:text-sm text-[#8A7B78] max-w-lg mx-auto mb-8 leading-relaxed">
          Receive private previews of new handloom drops, invitations to bridal trunk shows, and stories behind our master artisans.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 p-4 bg-white rounded-lg border border-[#C5A059] text-sm text-[#521225]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Thank you for subscribing! We've sent a welcome note to {email}.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-md bg-white border border-[#EADBCE] text-[#380C19] placeholder-[#8A7B78] focus:outline-none focus:border-[#7B1E3A] shadow-xs"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto shrink-0 whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        )}

        <p className="text-[11px] text-[#8A7B78] mt-3">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
