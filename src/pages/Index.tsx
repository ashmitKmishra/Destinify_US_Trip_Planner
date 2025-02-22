
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

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=2000&q=80')] bg-fixed bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/80 before:to-muted/90 before:backdrop-blur-sm">
      <Navbar />
      
      <main className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight"
            >
              Discover Your Perfect
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-accent inline-block"
              > USA Adventure</motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-lg md:text-xl text-muted-foreground"
            >
              Personalized travel experiences tailored to your mood, style, and dreams.
              Let's create your ideal journey across America.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate("/plan-by-filters")}
              >
                Plan by Filters
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="glass-card hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate("/custom-prompt")}
              >
                Enter Custom Prompt
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {["Personalized Itineraries", "Smart Budgeting", "Local Insights"].map((title, index) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="glass-card rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/40"
              >
                <h3 className="text-xl font-display mb-2">{title}</h3>
                <p className="text-muted-foreground">
                  {index === 0 && "Tailored travel plans based on your preferences and interests"}
                  {index === 1 && "Get accurate cost estimates for your entire journey"}
                  {index === 2 && "Discover hidden gems and authentic experiences"}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-24"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-display font-bold text-center mb-12"
            >
              Popular Destinations
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {destinationCards.map((destination, index) => (
                <motion.div
                  key={destination.title}
                  variants={fadeInUp}
                  className="glass-card rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      initial={{ scale: 1.2 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                      src={destination.image}
                      alt={destination.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold">{destination.title}</h3>
                    <p className="text-sm text-accent mb-2">{destination.location}</p>
                    <p className="text-muted-foreground mb-4">{destination.description}</p>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 transform hover:scale-105 transition-all duration-300"
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
