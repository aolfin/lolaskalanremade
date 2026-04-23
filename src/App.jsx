import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import CartPanel from './components/CartPanel';

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.title === dish.title);
      if (existing) {
        return prev.map((item) =>
          item.title === dish.title ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const removeFromCart = (title) => {
    setCart((prev) => prev.filter((item) => item.title !== title));
  };

  const updateQuantity = (title, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.title === title ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const checkoutCart = () => {
    const total = cart.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.price.replace('$', '')),
      0
    );
    if (total <= 0) {
      return;
    }

    alert(`Thank you for your order!\n\nTotal: $${total.toFixed(2)}\n\nYour food will be ready soon!`);
    setCart([]);
    setCartOpen(false);
  };

  const handleCartToggle = () => {
    setCartOpen((prev) => !prev);
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Header cartCount={cartCount} onCartToggle={handleCartToggle} />
      <CartPanel
        visible={cartOpen}
        cart={cart}
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
