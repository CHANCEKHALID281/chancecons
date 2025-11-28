import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">H&F Ltd</h3>
            <p className="text-sm opacity-90">
              Your trusted partner for construction equipment rentals, land levelling services, and quality building materials.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/#services" className="hover:text-accent transition-colors">Services</Link>
              <Link to="/#availability" className="hover:text-accent transition-colors">Availability</Link>
              <Link to="/#gallery" className="hover:text-accent transition-colors">Gallery</Link>
              <Link to="/#about" className="hover:text-accent transition-colors">About Us</Link>
              <Link to="/#contact" className="hover:text-accent transition-colors">Contact</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1-555-0123</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@hfltd.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Construction Ave, Building City</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} H&F Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
