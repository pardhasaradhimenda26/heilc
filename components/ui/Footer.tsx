"use client";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, Github } from "lucide-react";

const links = {
  Services: ["AI Platforms", "Mobile Apps", "LLM Integration", "Data Analytics"],
  Company: ["About", "Our Work", "Case Studies", "Contact"],
  Connect: ["LinkedIn", "Instagram", "GitHub", "hello@heilc.com"],
};

export default function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <h3
              style={{ fontFamily: "var(--font-bebas)", fontSize: "36px", letterSpacing: "0.08em" }}
              className="text-white mb-3"
            >
              HEILC
            </h3>
            <p className="text-white/30 text-xs leading-relaxed max-w-[180px]">
              Where Human Intelligence Meets the Future.
            </p>
            <div className="flex gap-3 mt-6">
              {[Linkedin, Instagram, Github, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-teal hover:border-teal/30 transition-all"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-white/60 text-xs tracking-widest uppercase mb-5">{category}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © 2026 HEILC. All rights reserved.
          </p>
          <p className="text-white/20 text-xs tracking-widest uppercase">
            POWERED BY AI — HEILC
          </p>
        </div>
      </div>
    </footer>
  );
}
