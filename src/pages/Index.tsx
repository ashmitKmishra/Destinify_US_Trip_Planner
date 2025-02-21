
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-muted">
      <Navbar />
      
      <main className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight">
              Discover Your Perfect
              <span className="text-accent"> USA Adventure</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              Personalized travel experiences tailored to your mood, style, and dreams.
              Let's create your ideal journey across America.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Plan by Filters
              </Button>
              <Button size="lg" variant="outline" className="glass-card">
                Enter Custom Prompt
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <div className="glass-card rounded-xl p-6 text-center">
              <h3 className="text-xl font-display mb-2">Personalized Itineraries</h3>
              <p className="text-muted-foreground">
                Tailored travel plans based on your preferences and interests
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <h3 className="text-xl font-display mb-2">Smart Budgeting</h3>
              <p className="text-muted-foreground">
                Get accurate cost estimates for your entire journey
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <h3 className="text-xl font-display mb-2">Local Insights</h3>
              <p className="text-muted-foreground">
                Discover hidden gems and authentic experiences
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
