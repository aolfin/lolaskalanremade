import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import CartPanel from './components/CartPanel';

// Use the backend public URL directly
const BACKEND_URL = 'https://lolas-backend-production.up.railway.app';

function App() {
  const [cart, setCart] = useState({ items: [] }); // Initialize cart as an object with items array
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true); // New state for loading cart

  // Fetch initial cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/cart`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, []);

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const updateCartBackend = async (action, payload) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cart/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action, ...payload }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart on backend');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart on backend:', error);
      alert('Failed to update cart. Please try again.');
      return null;
    }
  };

  const addToCart = async (dish) => {
    await updateCartBackend('add', { dish });
  };

  const removeFromCart = async (title) => {
    await updateCartBackend('remove', { title });
  };

  const updateQuantity = async (title, delta) => {
    await updateCartBackend('updateQuantity', { title, delta });
  };

  const checkoutCart = async () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The backend /api/orders now handles taking the current cart and finalizing it
        // No need to send cart data in the body explicitly here, as it fetches the current active cart
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const result = await response.json();
      console.log('Order submitted successfully:', result.order);

      alert(`Thank you for your order!\n\nOrder ID: ${result.order._id}\nTotal: $${result.order.total.toFixed(2)}\n\nYour food will be ready soon!`);

      // Update frontend cart with the new empty cart from the backend
      setCart(result.newCart);
      setCartOpen(false);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please check if the server is running and try again.');
    }
  };

  const handleCartToggle = () => {
    setCartOpen((prev) => !prev);
  };

  if (loadingCart) {
    return (
      <div className="App d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Header cartCount={cartCount} onCartToggle={handleCartToggle} />
      <CartPanel
        visible={cartOpen}
        cart={cart.items} // Pass cart.items to CartPanel
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onQuantityChange={updateQuantity}
        onCheckout={checkoutCart}
      />
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu onAddToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
