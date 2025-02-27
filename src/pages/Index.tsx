import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Sliders, MessageSquare, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2000&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 backdrop-blur-[2px]"></div>
        
        {/* Wave Shape Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" className="w-full h-auto fill-white">
            <path d="M0,192L48,170.7C96,149,192,107,288,106.7C384,107,480,149,576,154.7C672,160,768,128,864,117.3C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center px-4 pt-20">
          {/* Eye Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="4" />
              <circle cx="50" cy="50" r="15" fill="white" />
            </svg>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-bold text-white leading-tight"
          >
            Your American Adventure
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl font-display font-bold text-[#4e9af1] leading-tight"
          >
            Starts Here
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 backdrop-blur-md bg-black/30 p-6 rounded-lg max-w-2xl"
          >
            <p className="text-lg md:text-xl text-white">
              From the Grand Canyon to Times Square, craft your perfect USA journey with personalized itineraries and expert recommendations.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Feature Cards Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan by Filters Card */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="bg-[#EEF1FF] rounded-xl shadow-lg p-8 flex flex-col items-center text-center h-full">
            <Sliders className="w-16 h-16 text-[#3366CC] mb-6" />
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">Plan by Filters</h3>
            <p className="text-gray-600 mb-6 flex-grow">
              Design your journey using our smart filters for the perfect match to your travel style.
            </p>
            <Button className="w-full bg-[#3366CC] hover:bg-[#2855A9] text-white" onClick={() => navigate("/plan-by-filters")}>
              Start Planning
            </Button>
          </motion.div>
          
          {/* Custom Prompt Card */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} className="bg-[#FBE8FF] rounded-xl shadow-lg p-8 flex flex-col items-center text-center h-full">
            <MessageSquare className="w-16 h-16 text-[#9933CC] mb-6" />
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">Custom Prompt</h3>
            <p className="text-gray-600 mb-6 flex-grow">
              Tell us your dream vacation in your own words and watch as we bring it to life.
            </p>
            <Button className="w-full bg-[#9933CC] hover:bg-[#7722AA] text-white" onClick={() => navigate("/custom-prompt")}>
              Write Prompt
            </Button>
          </motion.div>
          
          {/* Browse Destinations Card */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.4
        }} className="bg-[#E3F4ED] rounded-xl shadow-lg p-8 flex flex-col items-center text-center h-full">
            <Leaf className="w-16 h-16 text-[#00A36A] mb-6" />
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">Browse Destinations</h3>
            <p className="text-gray-600 mb-6 flex-grow">
              Explore our curated collection of stunning locations across the United States.
            </p>
            <Button className="w-full bg-[#00A36A] hover:bg-[#008255] text-white" onClick={() => navigate("/plan-by-filters")}>
              Explore Now
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Why Choose Destinify Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1200&q=80" 
            alt="New York City Skyline" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-white mb-12 text-center"
          >
            Why Choose Destinify?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20"
            >
              <span className="text-yellow-400 text-2xl block mb-4">✨</span>
              <h3 className="text-xl font-display font-bold text-white mb-2">Personalized Experiences</h3>
              <p className="text-gray-200">Every itinerary is crafted to match your unique preferences.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20"
            >
              <span className="text-yellow-400 text-2xl block mb-4">💡</span>
              <h3 className="text-xl font-display font-bold text-white mb-2">Smart Recommendations</h3>
              <p className="text-gray-200">Our AI understands your travel style and budget.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20"
            >
              <span className="text-teal-400 text-2xl block mb-4">🗺️</span>
              <h3 className="text-xl font-display font-bold text-white mb-2">Local Insights</h3>
              <p className="text-gray-200">Get insider tips and hidden gems for each destination.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-12 text-center">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Your perfect USA adventure is just a few clicks away. Start planning today and create memories that last a lifetime.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => navigate("/plan-by-filters")}>
              Start Your Adventure
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
