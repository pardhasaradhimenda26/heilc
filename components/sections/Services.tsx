"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePersona } from "../features/PersonaContext";

const allServices = [
  { num: "01", title: "AI-Powered Web Platforms", tags: ["LLM", "Next.js", "Claude API"] },
  { num: "02", title: "Mobile App Development", tags: ["React Native", "Flutter", "iOS/Android"] },
  { num: "03", title: "Custom LLM & Chatbot Integration", tags: ["Claude", "OpenAI", "RAG"] },
  { num: "04", title: "Data Analytics & Visualization", tags: ["Python", "D3.js", "PostgreSQL"] },
  { num: "05", title: "Cloud Infrastructure & DevOps", tags: ["AWS", "Railway", "Vercel"] },
  { num: "06", title: "UI/UX Design & Prototyping", tags: ["Figma", "Framer", "Design Systems"] },
];

const personaOrder = {
  startup: [0, 2, 1, 5, 3, 4],
  enterprise: [3, 4, 0, 2, 1, 5],
  student: [0, 1, 2, 3, 4, 5],
};

export default function Services() {
  const { persona } = usePersona();
  const order = persona ? personaOrder[persona] : [0, 1, 2, 3, 4, 5];
  const services = order.map((i) => allServices[i]);

  return (
    <section id="services" className="py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-4"
          >
            — 02 SERVICES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px,6vw,72px)", lineHeight: 0.95 }}
          >
            <span className="text-white">WHAT WE BUILD</span>
            <br />
            <span className="text-gradient">FOR YOU</span>
          </motion.h2>
        </div>

        <div className="divide-y divide-white/8">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group flex items-center justify-between py-6 px-4 rounded-lg hover:bg-teal/5 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-8">
                <span className="text-white/20 text-xs font-mono w-6">{svc.num}</span>
                <h3
                  className="text-white group-hover:text-teal transition-colors duration-300"
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(22px,3vw,36px)" }}
                >
                  {svc.title}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-2">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full border border-white/10 text-white/40 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-teal group-hover:bg-teal/10 transition-all">
                  <ArrowUpRight size={14} className="text-white/40 group-hover:text-teal transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
