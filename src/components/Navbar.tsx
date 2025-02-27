
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { X, Menu, ArrowLeft, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "@/hooks/useAuthState";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user, loading } = useAuthState();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: -20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="fixed w-full z-50 nav-blur"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-display text-foreground"
            >
              Destinify USA
            </motion.div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/plan-by-filters">
            <Button variant="link" className="text-gray-700">Plan Trip</Button>
          </Link>
          <Link to="/custom-prompt">
            <Button variant="link" className="text-gray-700">Custom Prompt</Button>
          </Link>
          <Link to="/plan-by-filters">
            <Button variant="link" className="text-gray-700">Browse</Button>
          </Link>
          
          {loading ? (
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/profile")}>
                <User className="h-5 w-5 mr-2" />
                Profile
              </Button>
              <Button className="bg-accent hover:bg-accent/90" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button className="bg-accent hover:bg-accent/90" onClick={() => navigate("/login")}>
              Sign in / Sign up
            </Button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/plan-by-filters">
              <Button variant="ghost" className="w-full text-left justify-start">Plan Trip</Button>
            </Link>
            <Link to="/custom-prompt">
              <Button variant="ghost" className="w-full text-left justify-start">Custom Prompt</Button>
            </Link>
            <Link to="/plan-by-filters">
              <Button variant="ghost" className="w-full text-left justify-start">Browse</Button>
            </Link>
            
            {loading ? (
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <Button variant="ghost" className="w-full text-left justify-start" onClick={() => navigate("/profile")}>
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Button>
                <Button className="w-full bg-accent hover:bg-accent/90" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => navigate("/login")}>
                Sign in / Sign up
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
