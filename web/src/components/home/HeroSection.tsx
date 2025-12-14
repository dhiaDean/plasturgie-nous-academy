
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Développez vos compétences professionnelles";
  const [typingComplete, setTypingComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setTypingComplete(true);
    }
  }, [currentIndex, fullText]);

  const scrollToFormations = () => {
    const formationsSection = document.getElementById("formations");
    if (formationsSection) {
      formationsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1581094794329-c8112a89f564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-tunisiaBlue-900/90 to-tunisiaBlue-700/70"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-3 animate-fade-in">
          Plasturgie-Nous Academy
          </h1>
          <div className="h-12 md:h-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white mb-6">
              {typedText}
              {!typingComplete && <span className="ml-1 animate-pulse">|</span>}
            </h2>
          </div>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl animate-fade-in">
            Centre de formation professionnel spécialisé dans les domaines de la plasturgie et des techniques industrielles en Tunisie.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={scrollToFormations}
              className="bg-gradient-to-r from-tunisiaTeal-400 to-tunisiaTeal-600 hover:from-tunisiaTeal-500 hover:to-tunisiaTeal-700 text-white px-6 py-6 rounded-md text-lg"
            >
              Découvrir nos formations <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-black hover:bg-white/10 px-6 py-6 rounded-md text-lg"
            >
              Contactez-nous
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card px-4 py-5">
              <div className="font-bold text-3xl text-white mb-1">50+</div>
              <div className="text-white/80 text-sm">Formations</div>
            </div>
            <div className="glass-card px-4 py-5">
              <div className="font-bold text-3xl text-white mb-1">2000+</div>
              <div className="text-white/80 text-sm">Apprenants</div>
            </div>
            <div className="glass-card px-4 py-5">
              <div className="font-bold text-3xl text-white mb-1">15+</div>
              <div className="text-white/80 text-sm">Experts formateurs</div>
            </div>
            <div className="glass-card px-4 py-5">
              <div className="font-bold text-3xl text-white mb-1">98%</div>
              <div className="text-white/80 text-sm">Taux de satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Shape Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 md:h-24">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,150.07,105.77,221.79,78.45,278.94,58.16,312.34,63.15,321.39,56.44Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
