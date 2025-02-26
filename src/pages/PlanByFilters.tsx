import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { generateTripSuggestions } from "@/lib/api";
import type { TripSuggestion } from "@/types/trip";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const moodOptions = [
  { id: "adventurous", label: "Adventurous", icon: "🏃‍♂️" },
  { id: "relaxed", label: "Relaxed", icon: "🌴" },
  { id: "cultural", label: "Cultural", icon: "🎭" },
  { id: "romantic", label: "Romantic", icon: "💑" },
  { id: "energetic", label: "Energetic", icon: "⚡" },
  { id: "spiritual", label: "Spiritual/Reflective", icon: "🧘‍♂️" },
  { id: "family", label: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
  { id: "solo", label: "Solo Exploration", icon: "🎒" },
  { id: "luxurious", label: "Luxurious", icon: "✨" },
  { id: "budget", label: "Budget Conscious", icon: "💰" },
];

const placeTypes = [
  "Mountains",
  "Beaches",
  "Cities",
  "Countryside",
  "Historical Sites",
  "Nature & National Parks",
  "Adventure Hubs",
  "Cultural Villages",
  "Spa & Wellness Retreats",
  "Artistic/Creative Centers"
];

const PlanByFilters = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  const [placeType, setPlaceType] = useState("");
  const [budget, setBudget] = useState([2000]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);

  const handleGenerateItinerary = async () => {
    if (!selectedMood || !placeType) {
      toast({
        title: "Missing Information",
        description: "Please select both a mood and place type before generating an itinerary.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await generateTripSuggestions({
        mood: selectedMood,
        numberOfPeople: parseInt(numberOfPeople),
        placeType,
        budget: budget[0],
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setSuggestions(response.suggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate trip suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-muted">
      <Navbar />
      <main className="container mx-auto pt-24 px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-display font-bold">
              Plan Your Trip
            </h1>
            <p className="text-muted-foreground">
              Choose how you'd like to make your perfect itinerary
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="flex-1 py-8 glass-card">
                Plan with Filters
              </Button>
              <Button variant="outline" className="flex-1 py-8 glass-card opacity-50">
                Custom Prompt
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-card p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-display mb-6">What's your travel mood?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.id}
                    variant="outline"
                    className={`flex flex-col items-center p-4 h-auto aspect-square ${
                      selectedMood === mood.id ? "ring-2 ring-accent" : ""
                    }`}
                    onClick={() => setSelectedMood(mood.id)}
                  >
                    <span className="text-2xl mb-2">{mood.icon}</span>
                    <span className="text-sm text-center">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-display">Number of People</h2>
              <Input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                min="1"
                className="w-full"
              />
            </div>

            <div className="glass-card p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-display">Preferred Place Type</h2>
              <Select value={placeType} onValueChange={setPlaceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a place type" />
                </SelectTrigger>
                <SelectContent>
                  {placeTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
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
            
            <Button 
              size="lg" 
              className="w-full bg-accent hover:bg-accent/90 p-6 text-lg"
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
              <h2 className="text-2xl font-display font-bold text-center">
                Your Personalized Trip Suggestions
              </h2>
              
              <div className="grid gap-6">
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
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default PlanByFilters;
