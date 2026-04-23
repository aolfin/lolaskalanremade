import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Header({ cartCount, onCartToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen((open) => !open);
  const handleNavLinkClick = () => setMenuOpen(false);

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-warning sticky-top shadow-sm navbar-orange">
      <div className="container">
        <NavLink className="navbar-brand fw-bold text-white d-flex align-items-center gap-2" to="/">
          <img src="https://files.idyllic.app/files/static/100504?width=80&optimizer=image" alt="Lola's Kalan Logo" style={{ height: '40px', width: 'auto' }} />
          Lola's Kalan Bistro
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navMenu"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="navMenu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/" onClick={handleNavLinkClick}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/menu" onClick={handleNavLinkClick}>
                Menu
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/about" onClick={handleNavLinkClick}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/contact" onClick={handleNavLinkClick}>
                Contact
              </NavLink>
            </li>
            <li className="nav-item ms-3">
              <button type="button" className="btn btn-dark position-relative cart-toggle" onClick={onCartToggle}>
                <span role="img" aria-label="cart">
                  🛒
                </span>
                <span className="badge bg-warning text-dark position-absolute top-0 start-100 translate-middle rounded-pill">
                  {cartCount}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
