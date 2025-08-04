import React, { useEffect } from 'react';
import '../pageStyles/Products.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlice';
import Product from '../components/Product';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useLocation } from 'react-router-dom';

function Products() {
  const { loading, products, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();

  const searchParam = new URLSearchParams(location.search);
  const keyword = searchParam.get('keyword')


  useEffect(() => {
    dispatch(getProduct({ keyword })); // Pass keyword to the thunk
  }, [dispatch, keyword])

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: 'top-right', autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <PageTitle title="All Products" />
      <Navbar />

      <div className="products-layout">
        <div className="filter-section">
          <h3 className="filter-heading">CATEGORIES</h3>
        </div>
        <div className="products-section">
          <div className="products-product-container">
            {products?.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Products;

