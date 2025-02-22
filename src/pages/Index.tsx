
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const destinationCards = [
  {
    title: "Yellowstone National Park",
    location: "Wyoming",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    mood: "Adventurous",
    description: "Geothermal wonders and wildlife encounters",
  },
  {
    title: "Miami Beach",
    location: "Florida",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    mood: "Energetic",
    description: "Vibrant culture and beautiful beaches",
  },
  {
    title: "Rocky Mountains",
    location: "Colorado",
    image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed",
    mood: "Relaxed",
    description: "Scenic mountain vistas and outdoor activities",
  },
  {
    title: "New York City",
    location: "New York",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    mood: "Cultural",
    description: "Urban adventures and cultural experiences",
  },
  {
    title: "Napa Valley",
    location: "California",
    image: "https://images.unsplash.com/photo-1519072812063-9f6e8fef2c2b",
    mood: "Luxurious",
    description: "Wine country luxury and culinary delights",
  },
  {
    title: "Maui",
    location: "Hawaii",
    image: "https://images.unsplash.com/photo-1542259009477-d625272157b7",
    mood: "Romantic",
    description: "Tropical paradise and beachside romance",
  }
];

const Index = () => {
  const navigate = useNavigate();

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
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white"
                onClick={() => navigate("/plan-by-filters")}
              >
                Plan by Filters
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="glass-card"
                onClick={() => navigate("/custom-prompt")}
              >
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

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-24"
          >
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Popular Destinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {destinationCards.map((destination, index) => (
                <motion.div
                  key={destination.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold">{destination.title}</h3>
                    <p className="text-sm text-accent mb-2">{destination.location}</p>
                    <p className="text-muted-foreground mb-4">{destination.description}</p>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90"
                      onClick={() => navigate("/plan-by-filters")}
                    >
                      Plan Your Next Trip
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Index;
