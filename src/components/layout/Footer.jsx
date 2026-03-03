import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="SeVoOo" 
              className="h-10 w-auto object-contain" 
            />
            <p className="text-text-muted text-sm">
              © {new Date().getFullYear()} جميع الحقوق محفوظة
            </p>
          </div>
          <p className="text-text-muted text-sm flex items-center gap-1">
            Made by Paula <Heart className="w-3.5 h-3.5 text-danger fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;