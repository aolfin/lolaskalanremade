import { useState, useEffect } from 'react';
import PageHeader from './PageHeader';

const BACKEND_URL = 'https://lolas-backend-production.up.railway.app';

function Menu({ onAddToCart }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/menu`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setDishes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading our delicious menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          Error: {error}. Please make sure the backend server is running.
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Our Menu" subtitle="Your local favorites, reimagined with modern flair." />
      <section className="container py-5">
      <div className="row g-4">
        {dishes.length === 0 ? (
          <div className="col-12 text-center">
            <p>No dishes found. Please seed the database.</p>
          </div>
        ) : (
          dishes.map((dish) => (
            <div key={dish._id || dish.title} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 menu-card">
                <img src={dish.image} className="card-img-top" alt={dish.title} />
                <div className="card-body">
                  <h3 className="card-title">{dish.title}</h3>
                  <p className="card-text">{dish.description}</p>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-primary">{dish.price}</span>
                  <button className="btn btn-sm btn-warning" onClick={() => onAddToCart(dish)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
    </>
  );
}

export default Menu;
