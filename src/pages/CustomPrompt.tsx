
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { generateCustomTrip } from "@/lib/api";
import type { TripSuggestion } from "@/types/trip";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const CustomPrompt = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);

  const handleGenerateItinerary = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a prompt before generating an itinerary.",
        variant: "destructive",
      });
      return;
    }

    if (!localStorage.getItem('openai_api_key')) {
      setShowApiKeyModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await generateCustomTrip(prompt);

      if (response.error) {
        throw new Error(response.error);
      }

      setSuggestions(response.suggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate custom trip plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <Button 
              size="lg" 
              className="w-full bg-accent hover:bg-accent/90"
              onClick={handleGenerateItinerary}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Itinerary"}
            </Button>
          </motion.div>

          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                    <Carousel>
                      <CarouselContent>
                        {suggestion.images.map((image, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <img
                              src={image}
                              alt={`${suggestion.destination} view ${imgIndex + 1}`}
                              className="w-full h-64 object-cover"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>

                  <h3 className="text-xl font-display font-bold mb-2">
                    {suggestion.destination}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {suggestion.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Duration:</span>
                      {suggestion.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Estimated Budget:</span>
                      ${suggestion.budget}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Suggested Activities:</h4>
                    <ul className="list-disc list-inside">
                      {suggestion.activities.map((activity, actIndex) => (
                        <li key={actIndex}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
      <ApiKeyModal 
        open={showApiKeyModal} 
        onClose={() => setShowApiKeyModal(false)} 
      />
    </div>
  );
};

export default CustomPrompt;
