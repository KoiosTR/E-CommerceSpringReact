import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center space-x-4">
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => console.log('Add to cart:', product.id)}
            >
              <ShoppingCart className="h-6 w-6 text-gray-800" />
            </button>
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={`h-6 w-6 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-800'}`}
              />
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-1 text-gray-600">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}