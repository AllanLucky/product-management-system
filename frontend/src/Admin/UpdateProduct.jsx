import React, { useEffect, useState } from 'react';
import '../AdminStyles/UpdateProduct.css';
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import { removeErrors, removeSuccess, updateProduct } from '../features/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductDetails } from '../features/products/productSlice';
import { toast } from 'react-toastify';

function UpdateProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [oldImages, setOldImages] = useState([]);

    const { product } = useSelector((state) => state.product);
    const { success, error, loading } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const categories = [
        "Laptop",
        "TVs",
        "Headphones",
        "Watches",
        "Tablets",
        "Mobiles",
        "Cameras",
        "Speakers",
        "Gaming Consoles",
        "Smart Home Devices",
        "Accessories",
        "Printers",
        "Monitors",
        "Networking Devices",
    ];

    // Fetch product details
    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    // Populate form with product details
    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setPrice(product.price || "");
            setDescription(product.description || "");
            setCategory(product.category || "");
            setStock(product.stock || "");
            setOldImages(product.images || []);
        }
    }, [product]);

    // Handle image upload
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const base64Images = [];
        const previews = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    base64Images.push(reader.result);
                    previews.push(reader.result);

                    if (base64Images.length === files.length) {
                        setImages(base64Images);
                        setImagesPreview(previews);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    // Handle form submit
    const updateProductSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        // Attach new images
        images.forEach((img) => myForm.append("images", img));

        // Optionally keep old images (if backend supports it)
        oldImages.forEach((img) => myForm.append("oldImages", JSON.stringify(img)));

        dispatch(updateProduct({ id, formData: myForm }));
    };

    // Success handler
    useEffect(() => {
        if (success) {
            toast.success("Product Updated Successfully", {
                position: "top-right",
                autoClose: 3000,
            });
            dispatch(removeSuccess());
            navigate("/admin/products");
        }
    }, [dispatch, success, navigate]);

    // Error handler
    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    // Remove old image from preview (local only)
    const removeOldImage = (index) => {
        setOldImages(oldImages.filter((_, i) => i !== index));
    };

    return (
        <>
            <PageTitle title="Update Product" />
            <Navbar />

            <div className="update-product-wrapper">
                <h1 className="update-product-title">Update Product</h1>

                <form
                    className="update-product-form"
                    encType="multipart/form-data"
                    onSubmit={updateProductSubmit}
                >
                    {/* Product Name */}
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        className="update-product-input"
                        required
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* Product Price */}
                    <label htmlFor="price">Product Price</label>
                    <input
                        type="number"
                        className="update-product-input"
                        required
                        id="price"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    {/* Product Description */}
                    <label htmlFor="description">Product Description</label>
                    <textarea
                        className="update-product-textarea"
                        required
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* Product Category */}
                    <label htmlFor="category">Category</label>
                    <select
                        name="category"
                        id="category"
                        className="update-product-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* Product Stock */}
                    <label htmlFor="stock">Product Stock</label>
                    <input
                        type="number"
                        className="update-product-input"
                        required
                        id="stock"
                        name="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />

                    {/* Product Images */}
                    <div className="update-product-file-wrapper">
                        <label htmlFor="images">Upload Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="update-product-file-input"
                            id="images"
                            name="images"
                            multiple
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* New Images Preview */}
                    <div className="update-product-preview-wrapper">
                        {imagesPreview.map((img, index) => (
                            <img
                                src={img}
                                alt="product Preview"
                                key={index}
                                className="update-product-preview-image"
                            />
                        ))}
                    </div>

                    {/* Old Images Preview with Remove */}
                    <div className="update-product-preview-wrapper">
                        {oldImages.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img.url}
                                    alt="old-product Preview"
                                    className="update-product-old-images-wrapper"
                                />
                                <button
                                    type="button"
                                    className="remove-old-image-btn"
                                    onClick={() => removeOldImage(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="update-product-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default UpdateProduct;
