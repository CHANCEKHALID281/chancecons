import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, Truck } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
          <Truck className="w-8 h-8" />
          <span>H&F Ltd</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/#services" className="text-foreground hover:text-primary transition-colors">
            Services
          </Link>
          <Link to="/#availability" className="text-foreground hover:text-primary transition-colors">
            Availability
          </Link>
          <Link to="/#gallery" className="text-foreground hover:text-primary transition-colors">
            Gallery
          </Link>
          <Link to="/#about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/#contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
          <Link to="/admin/login">
            <Button variant="outline" size="sm">Admin</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg md:hidden">
            <div className="flex flex-col p-4 gap-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/#services" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
              <Link to="/#availability" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Availability
              </Link>
              <Link to="/#gallery" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Gallery
              </Link>
              <Link to="/#about" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/#contact" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Admin</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
