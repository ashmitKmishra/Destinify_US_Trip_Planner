
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const PlanByFilters = () => {
  const [mood, setMood] = useState("");
  const [budget, setBudget] = useState([2000]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-muted">
      <Navbar />
      <main className="container mx-auto pt-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-12"
        >
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold mb-4">
              Customize Your Journey
            </h1>
            <p className="text-muted-foreground">
              Select your preferences to discover the perfect USA destination for you.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-8"
          >
            <div className="glass-card p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-display mb-4">What's your mood?</h2>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your travel mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adventurous">Adventurous</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="glass-card p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-display">Budget Range</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Adjust your maximum budget: ${budget}
              </p>
              <Slider
                value={budget}
                onValueChange={setBudget}
                max={10000}
                step={100}
                className="w-full"
              />
            </div>

            {/* Add more filter sections here */}
            
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90">
              Find My Perfect Trip
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default PlanByFilters;
