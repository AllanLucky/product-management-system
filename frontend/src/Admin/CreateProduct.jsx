import React, { useEffect, useState } from "react";
import "../AdminStyles/CreateProduct.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
    createProduct,
    removeErrors,
    removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate

function CreateProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // <-- initialize navigate
    const { success, loading, error } = useSelector((state) => state.admin);

    const [name, setName] = useState("");
    const [price, setPrice] = useState();
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState();
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
        "Mobile Phones",
        "Laptops",
        "Tablets",
        "Televisions",
        "Cameras",
        "Headphones",
        "Speakers",
        "Smart Watches",
        "Gaming Consoles",
        "Printers",
        "Monitors",
        "Networking Devices",
        "Smart Home Devices",
        "Accessories"
    ];


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
                    setImages(base64Images);
                    setImagesPreview(previews);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !price || !description || !category || !stock || images.length === 0) {
            toast.error("Please fill all fields and upload at least one image", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);
        images.forEach((img) => myForm.append("images", img));

        dispatch(createProduct(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success("Product Created Successfully", {
                position: "top-right",
                autoClose: 3000,
            });
            dispatch(removeSuccess());

            // Reset form fields
            setName("");
            setPrice();
            setDescription("");
            setCategory("");
            setStock();
            setImages([]);
            setImagesPreview([]);

            // Navigate to all products page
            navigate("/admin/products"); // <-- navigate after success
        }
    }, [dispatch, success, error, navigate]);

    return (
        <>
            <PageTitle title="Create Product" />
            <Navbar />
            <div className="create-product-container">
                <h1 className="form-title">Create New Product</h1>
                <form className="product-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Product Name"
                        className="form-input"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Product Price"
                        className="form-input"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Product Description"
                        className="form-input"
                        required
                    />
                    <select
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Stock Quantity"
                        className="form-input"
                        required
                    />
                    <div className="file-input-container">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-input-file"
                        />
                    </div>
                    <div className="image-preview-container">
                        {imagesPreview.length > 0 ? (
                            imagesPreview.map((img, idx) => (
                                <img key={idx} src={img} alt="preview" className="image-preview" />
                            ))
                        ) : (
                            <img src="/placeholder.png" alt="preview" className="image-preview" />
                        )}
                    </div>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Creating Product..." : "Create Product"}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default CreateProduct;
