import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
const destinationCards = [{
  title: "Yellowstone National Park",
  location: "Wyoming",
  images: ["https://images.unsplash.com/photo-1472396961693-142e6e269027", "https://images.unsplash.com/photo-1576006445381-c11ed11a9324", "https://images.unsplash.com/photo-1575321539738-048766e46c4f", "https://images.unsplash.com/photo-1576180616247-f5cf552389b3"],
  mood: "Adventurous",
  description: "Geothermal wonders and wildlife encounters"
}, {
  title: "Miami Beach",
  location: "Florida",
  images: ["https://images.unsplash.com/photo-1500375592092-40eb2168fd21", "https://images.unsplash.com/photo-1535498730771-e735b998cd64", "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2", "https://images.unsplash.com/photo-1603888613934-ee2f7d143dd0"],
  mood: "Energetic",
  description: "Vibrant culture and beautiful beaches"
}, {
  title: "Rocky Mountains",
  location: "Colorado",
  images: ["https://images.unsplash.com/photo-1458668383970-8ddd3927deed", "https://images.unsplash.com/photo-1508923567004-3a6b8004f3d7", "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800", "https://images.unsplash.com/photo-1508739773434-c26b3d09e071"],
  mood: "Relaxed",
  description: "Scenic mountain vistas and outdoor activities"
}, {
  title: "New York City",
  location: "New York",
  images: ["https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9", "https://images.unsplash.com/photo-1522083165195-3424ed129620", "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee", "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7"],
  mood: "Cultural",
  description: "Urban adventures and cultural experiences"
}, {
  title: "Napa Valley",
  location: "California",
  images: ["https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", "https://images.unsplash.com/photo-1541971740285-39bca3874452", "https://images.unsplash.com/photo-1507434745378-349e95a40935", "https://images.unsplash.com/photo-1592845994419-1b1b37e5af8a"],
  mood: "Luxurious",
  description: "Wine country luxury and culinary delights"
}, {
  title: "Maui",
  location: "Hawaii",
  images: ["https://images.unsplash.com/photo-1542259009477-d625272157b7", "https://images.unsplash.com/photo-1542261777448-23d2a287091c", "https://images.unsplash.com/photo-1598135753163-6167c1a1ad65", "https://images.unsplash.com/photo-1483168534941-c6331758e92d"],
  mood: "Romantic",
  description: "Tropical paradise and beachside romance"
}];
const fadeInUp = {
  initial: {
    opacity: 0,
    y: 40
  },
  animate: {
    opacity: 1,
    y: 0
  },
  transition: {
    duration: 0.6
  }
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
  return <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=2000&q=80')] bg-fixed bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/80 before:to-muted/90 before:backdrop-blur-sm">
      <Navbar />
      
      <main className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight">
              Discover Your Perfect
              <motion.span initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8,
              delay: 0.6
            }} className="text-accent inline-block"> USA Adventure</motion.span>
            </motion.h1>
            
            <motion.p initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.8,
            delay: 1
          }} className="text-lg md:text-xl text-muted-foreground">
              Personalized travel experiences tailored to your mood, style, and dreams.
              Let's create your ideal journey across America.
            </motion.p>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 1.4
          }} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white transform hover:scale-105 transition-all duration-300" onClick={() => navigate("/plan-by-filters")}>
                Plan by Filters
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/custom-prompt")} className="glass-card transform hover:scale-105 transition-all duration-300 bg-zinc-500 hover:bg-zinc-400">
                Enter Custom Prompt
              </Button>
            </motion.div>
          </div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{
          once: true
        }} className="mt-16 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {["Personalized Itineraries", "Smart Budgeting", "Local Insights"].map((title, index) => <motion.div key={title} variants={fadeInUp} whileHover={{
            scale: 1.05,
            y: -10,
            backgroundColor: "rgba(255, 255, 255, 0.3)"
          }} transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }} className="glass-card rounded-xl p-8 text-center transform cursor-pointer">
                <h3 className="text-2xl font-display mb-4 text-foreground">{title}</h3>
                <p className="text-muted-foreground text-lg">
                  {index === 0 && "Tailored travel plans based on your preferences and interests"}
                  {index === 1 && "Get accurate cost estimates for your entire journey"}
                  {index === 2 && "Discover hidden gems and authentic experiences"}
                </p>
              </motion.div>)}
          </motion.div>

          <motion.section initial="initial" whileInView="animate" viewport={{
          once: true
        }} variants={staggerContainer} className="mt-24">
            <motion.h2 variants={fadeInUp} className="text-3xl font-display font-bold text-center mb-12">
              Popular Destinations
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {destinationCards.map((destination, index) => <motion.div key={destination.title} variants={fadeInUp} className="glass-card rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                  <div className="relative h-48 overflow-hidden">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {destination.images.map((image, imageIndex) => <CarouselItem key={imageIndex}>
                            <img src={image} alt={`${destination.title} view ${imageIndex + 1}`} className="w-full h-48 object-cover" />
                          </CarouselItem>)}
                      </CarouselContent>
                      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                    </Carousel>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold">{destination.title}</h3>
                    <p className="text-sm mb-2 text-orange-900 font-semibold">{destination.location}</p>
                    <p className="mb-4 text-orange-900 font-medium text-sm">{destination.description}</p>
                    <Button className="w-full bg-accent hover:bg-accent/90 transform hover:scale-105 transition-all duration-300" onClick={() => navigate("/plan-by-filters")}>
                      Plan Your Next Trip
                    </Button>
                  </div>
                </motion.div>)}
            </div>
          </motion.section>
        </div>
      </main>
    </div>;
};
export default Index;