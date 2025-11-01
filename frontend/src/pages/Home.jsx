import React, { useEffect } from 'react';
import '../pageStyles/Home.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import Product from '../components/Product';
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader'; // Capitalized the import
import { getProduct, removeErrors } from '../features/products/productSlice';
import { toast } from 'react-toastify';

function Home() {
    const { loading, error, products, productCount } = useSelector((state) => state.product);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProduct({ keyword: "" })); // Fetch all products on home page load
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    return (
        <>
            {loading ? (
                <Loader /> // Capitalized usage
            ) : (
                <>
                    <PageTitle title="PrimeBrandshop" />
                    <Navbar />

                    <main className="home-container">
                        <ImageSlider />
                        <h2 className="home-heading">Trending Now</h2>
                        <div className="home-product-container">
                            {products.map((product, index) => (
                                <Product product={product} key={`${product._id}-${index}`} />
                            ))}
                        </div>
                    </main>

                    <Footer />
                </>
            )}
        </>
    );
}

export default Home;

