import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('wishlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item.id === product.id)
    if (exists) {
      setWishlistItems(wishlistItems.filter((item) => item.id !== product.id))
    } else {
      setWishlistItems([...wishlistItems, { ...product, image_url: product.img || product.image_url }])
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)