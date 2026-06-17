"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Persona = "startup" | "enterprise" | "student" | null;

interface DetectionData {
  country: string;
  city: string;
  region: string;
  timezone: string;
  language: string;
  referrer: string;
  detectedPersona: string;
  reason: string;
  signals: {
    fromLinkedIn: boolean;
    fromGitHub: boolean;
    isEnterpriseCountry: boolean;
    isStartupEcosystem: boolean;
  };
}

interface PersonaContextType {
  persona: Persona;
  setPersona: (p: Persona) => void;
  detectionData: DetectionData | null;
  isAutoDetected: boolean;
  autoDetecting: boolean;
  behaviorScore: number;
  trackBehavior: (action: string) => void;
}

const PersonaContext = createContext<PersonaContextType>({
  persona: null,
  setPersona: () => {},
  detectionData: null,
  isAutoDetected: false,
  autoDetecting: true,
  behaviorScore: 0,
  trackBehavior: () => {},
});

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>(null);
  const [detectionData, setDetectionData] = useState<DetectionData | null>(null);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(true);
  const [behaviorScore, setBehaviorScore] = useState(0);

  const behaviorMap: Record<string, number> = {
    viewed_services: 10,
    viewed_case_studies: 15,
    opened_chatbot: 20,
    scrolled_fast: -5,
    scrolled_slow: 10,
    time_on_capabilities: 15,
    clicked_enterprise_service: 25,
    clicked_contact: 30,
  };

  const trackBehavior = (action: string) => {
    const score = behaviorMap[action] || 0;
    setBehaviorScore((prev) => {
      const newScore = prev + score;
      if (newScore > 50 && !isAutoDetected) setPersonaState("enterprise");
      else if (newScore > 25 && !isAutoDetected) setPersonaState("startup");
      return newScore;
    });
  };

  const setPersona = (p: Persona) => {
    setPersonaState(p);
    if (p) {
      localStorage.setItem("heilc-persona", p);
      localStorage.setItem("heilc-persona-time", Date.now().toString());
    }
  };

  useEffect(() => {
    const autoDetect = async () => {
      const saved = localStorage.getItem("heilc-persona");
      const savedTime = localStorage.getItem("heilc-persona-time");
      const isRecent =
        savedTime && Date.now() - parseInt(savedTime) < 24 * 60 * 60 * 1000;

      if (saved && isRecent) {
        setPersonaState(saved as Persona);
        setAutoDetecting(false);
        return;
      }

      try {
        const res = await fetch("/api/detect");
        const data: DetectionData = await res.json();
        setDetectionData(data);

        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const isLargeScreen = typeof window !== "undefined" && window.innerWidth > 1440;

        let finalPersona: Persona = data.detectedPersona as Persona;

        if (isMobile && data.detectedPersona === "enterprise") finalPersona = "startup";
        if (isLargeScreen && data.signals?.isStartupEcosystem) finalPersona = "startup";
        if (data.signals?.fromLinkedIn) finalPersona = "enterprise";
        if (data.signals?.fromGitHub) finalPersona = "startup";

        setPersonaState(finalPersona);
        setIsAutoDetected(true);
      } catch {
        setPersonaState(null);
      } finally {
        setAutoDetecting(false);
      }
    };

    autoDetect();
  }, []);

  return (
    <PersonaContext.Provider
      value={{
        persona,
        setPersona,
        detectionData,
        isAutoDetected,
        autoDetecting,
        behaviorScore,
        trackBehavior,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export const usePersona = () => useContext(PersonaContext);
