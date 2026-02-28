
import { Link } from "react-router-dom";
import { useCart } from "../../store/CartContext";
import { ShoppingCart, Heart, Search, User } from 'lucide-react';
import { useState } from 'react';
import Button from "../ui/Button";

const Navbar = () => {
  const { cartItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-surface/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-heading text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            SeVoOo
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden !p-2"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>


            <Link to="/cart">
              <Button variant="ghost" size="sm" className="!p-2 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1 animate-in zoom-in">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>

          </div>
        </div>


      </div>
    </nav>
  );
};

export default Navbar;