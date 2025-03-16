
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, MapPin, User, Users, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CustomPrompt = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);
  const [currentApiType, setCurrentApiType] = useState<"openai" | "deepseek">("deepseek");

  const handleGenerateItinerary = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a prompt before generating an itinerary.",
        variant: "destructive",
      });
      return;
    }

    const hasDeepSeekKey = localStorage.getItem('deepseek_api_key');
    const hasOpenAIKey = localStorage.getItem('openai_api_key');

    if (!hasDeepSeekKey && !hasOpenAIKey) {
      setCurrentApiType("deepseek"); // Default to DeepSeek for new keys
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
      toast({
        title: "Itinerary Generated",
        description: "Your custom itinerary has been created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate custom trip plan. Please try again.",
        variant: "destructive",
      });
      
      // If OpenAI key failed and we have no DeepSeek key, open the modal to add DeepSeek key
      if (error.message?.includes('OpenAI API key') && !hasDeepSeekKey) {
        setCurrentApiType("deepseek");
        setShowApiKeyModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-muted">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4">
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
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Try prompts like: "A 5-day family trip to Grand Canyon", "Weekend getaway to New York City", 
                or "Road trip along California coast with hiking spots"
              </AlertDescription>
            </Alert>
            
            <Textarea
              placeholder="Tell us what kind of trip you want, duration, activities you enjoy, budget considerations, and any specific interests..."
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
              {loading ? "Generating your perfect trip..." : "Generate Itinerary"}
            </Button>
          </motion.div>

          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Carousel>
                      <CarouselContent>
                        {suggestion.images?.map((image, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <img
                              src={image}
                              alt={`${suggestion.destination} view ${imgIndex + 1}`}
                              className="w-full h-64 object-cover"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-display font-bold mb-2">
                      {suggestion.destination}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {suggestion.summary}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span><strong>Duration:</strong> {suggestion.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span><strong>Budget:</strong> ${suggestion.budget.toLocaleString()}</span>
                      </div>
                    </div>

                    <Tabs defaultValue="overview" className="mb-6">
                      <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
                        <TabsTrigger value="tips">Travel Tips</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold mb-2">Top Activities</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {suggestion.activities?.map((activity, actIndex) => (
                                <li key={actIndex}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="itinerary" className="pt-4">
                        <div className="space-y-4">
                          {suggestion.itinerary?.map((day, dayIndex) => (
                            <Card key={dayIndex}>
                              <CardHeader className="pb-2">
                                <CardTitle>Day {day.day}: {day.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-3">{day.description}</p>
                                <div className="mb-3">
                                  <h5 className="font-semibold mb-1">Activities:</h5>
                                  <ul className="list-disc list-inside pl-2">
                                    {day.activities?.map((activity, i) => (
                                      <li key={i}>{activity}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-semibold mb-1">Accommodation:</h5>
                                  <p>{day.accommodation}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="tips" className="pt-4">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold mb-2">Travel Tips</h4>
                          <ul className="list-disc list-inside space-y-2">
                            {suggestion.travelTips?.map((tip, tipIndex) => (
                              <li key={tipIndex}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
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
        defaultTab={currentApiType}
      />
    </div>
  );
};

export default CustomPrompt;
