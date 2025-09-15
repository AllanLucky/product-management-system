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
import { useNavigate } from "react-router-dom";

function CreateProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { success, loading, error } = useSelector((state) => state.admin);

    const [name, setName] = useState("");
    const [price, setPrice] = useState();
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState();
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    // Short category keys for backend
    const categoryKeys = [
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
        myForm.set("category", categoryMap[category]); // ✅ send full name to backend
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

            setName("");
            setPrice();
            setDescription("");
            setCategory("");
            setStock();
            setImages([]);
            setImagesPreview([]);

            navigate("/admin/products");
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
                        {categoryKeys.map((key) => (
                            <option key={key} value={key}>
                                {categoryMap[key]}
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
