
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";

const CustomPrompt = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-muted">
      <Navbar />
      <main className="container mx-auto pt-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <h1 className="text-4xl font-display font-bold text-center">
            Tell Us Your Dream Trip
          </h1>
          <p className="text-center text-muted-foreground">
            Describe your ideal USA adventure and we'll create a personalized itinerary just for you.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-xl"
          >
            <Textarea
              placeholder="Example: I want a 5-day trip to explore the national parks in Utah with some hiking and local food experiences..."
              className="min-h-[200px] mb-4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90">
              Generate Itinerary
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CustomPrompt;
