import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('luxegold_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('luxegold_wishlist', JSON.stringify(items));
  }, [items]);

  const toggleWishlist = (product) => {
    setItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
