import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-2">
              <p>123 Fashion Street</p>
              <p>Istanbul, Turkey 34000</p>
              <p>+90 (212) 555-0123</p>
              <p>info@shopstyle.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <div className="space-y-2">
              <p><Link to="/" className="hover:text-gray-300">Anasayfa</Link></p>
              <p><Link to="/why-us" className="hover:text-gray-300">Neden Biz</Link></p>
              <p><Link to="/address" className="hover:text-gray-300">Adres</Link></p>
              <p><Link to="/login" className="hover:text-gray-300">Giriş Yap</Link></p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sosyal Medya</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ShopStyle. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}