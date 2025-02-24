import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { X, Menu } from "lucide-react";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <motion.nav initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="fixed w-full z-50 nav-blur">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2
      }} className="text-2xl font-display text-foreground">
          Destinify USA
        </motion.div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Button variant="link" className="text-gray-700">Browse</Button>
          <Button variant="link" className="text-zinc-700">Plan Trip</Button>
          <Button variant="link" className="text-gray-700">About</Button>
          <Button className="bg-accent hover:bg-accent/90">Sign up/Sign in</Button>
        </div>
        
        {/* Mobile Menu Button */}
        <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="md:hidden bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Button variant="ghost" className="w-full text-left justify-start">Browse</Button>
            <Button variant="ghost" className="w-full text-left justify-start">Plan Trip</Button>
            <Button variant="ghost" className="w-full text-left justify-start">About</Button>
            <Button className="w-full bg-accent hover:bg-accent/90">Sign up/Sign in</Button>
          </div>
        </motion.div>}
    </motion.nav>;
};
export default Navbar;