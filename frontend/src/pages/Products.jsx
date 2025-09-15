import React, { useEffect, useState } from 'react';
import '../pageStyles/Products.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlice';
import Product from '../components/Product';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import NoProducts from '../components/NoProducts';
import Pagination from '../components/Pagination';

function Products() {
  const { loading, error, products, resultPerPage, productCount, totalPages } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParam = new URLSearchParams(location.search);
  const category = searchParam.get("category"); // short name from URL
  const keyword = searchParam.get("keyword");
  const pageFromURL = parseInt(searchParam.get('page'), 10) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);

  // Short names for routing
  const categories = [
    "mobile",
    "laptop",
    "tablet",
    "tvs",
    "camera",
    "headphone",
    "speakers",
    "watch",
    "gaming",
    "printers",
    "monitors",
    "networking",
    "smarthome",
    "accessories"
  ];

  // Full names for display
  const categoryMap = {
    mobile: "Mobile Phones",
    laptop: "Laptops",
    tablet: "Tablets",
    tvs: "Televisions",
    camera: "Cameras",
    headphone: "Headphones",
    speakers: "Speakers",
    watch: "Smart Watches",
    gaming: "Gaming Consoles",
    printers: "Printers",
    monitors: "Monitors",
    networking: "Networking Devices",
    smarthome: "Smart Home Devices",
    accessories: "Accessories"
  };

  useEffect(() => {
    const fullCategory = category ? categoryMap[category] : "";
    dispatch(getProduct({ keyword, page: currentPage, category: fullCategory }));
  }, [dispatch, keyword, currentPage, category]);

  useEffect(() => {
    if (error && error !== 'No products found') {
      toast.error(error.message || error, {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const newSearchParams = new URLSearchParams(location.search);
      if (page === 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  const handleCategoryClick = (cat) => {
    const newSearchParams = new URLSearchParams(location.search);
    if (cat) {
      newSearchParams.set('category', cat); // short name in URL
    } else {
      newSearchParams.delete('category');
    }
    newSearchParams.set('page', 1);
    navigate(`?${newSearchParams.toString()}`);
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <PageTitle title="All Products" />
      <Navbar />

      <div className="products-layout">
        <div className="filter-section">
          <h3 className="filter-heading">CATEGORIES</h3>
          <ul>
            {categories.map((cat) => (
              <li
                key={cat}
                className={cat === category ? 'active-category' : ''}
                onClick={() => handleCategoryClick(cat)}
              >
                {categoryMap[cat]}
              </li>
            ))}
          </ul>
        </div>

        <div className="products-section">
          {products.length > 0 ? (
            <div className="products-product-container">
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <NoProducts keyword={keyword} />
          )}

          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalpages={totalPages}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Products;
