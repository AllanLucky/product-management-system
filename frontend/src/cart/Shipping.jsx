import React, { useState, useEffect } from 'react';
import '../CartStyles/Shipping.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutPath from './CheckoutPath';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Country, State, City } from 'country-state-city';
import { saveShippingInfo } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';

function Shipping() {
    const { shippingInfo } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Shipping form state
    const [address, setAddress] = useState(shippingInfo?.address || "");
    const [pinCode, setPinCode] = useState(shippingInfo?.pinCode || "");
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo?.phoneNumber || "");
    const [country, setCountry] = useState(shippingInfo?.country || "");
    const [state, setState] = useState(shippingInfo?.state || "");
    const [city, setCity] = useState(shippingInfo?.city || "");

    // Dropdown lists
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Load countries
    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    // Reset state/city
    const resetLocation = () => {
        setState("");
        setCity("");
        setCities([]);
    };

    // When country changes → update states & phone prefix
    useEffect(() => {
        if (country) {
            const countryStates = State.getStatesOfCountry(country) || [];
            setStates(countryStates);
            resetLocation();

            const countryData = Country.getCountryByCode(country);
            if (countryData?.phonecode) {
                setPhoneNumber(prev =>
                    prev.startsWith(`+${countryData.phonecode}`) ? prev : `+${countryData.phonecode}`
                );
            }
        } else {
            setStates([]);
            resetLocation();
            setPhoneNumber("");
        }
    }, [country]);

    // When state changes → update cities
    useEffect(() => {
        if (state) {
            const stateCities = City.getCitiesOfState(country, state) || [];
            setCities(stateCities);
            setCity("");
        } else {
            setCities([]);
            setCity("");
        }
    }, [state, country]);

    // Phone handler → always keep country code prefix
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\s+/g, "");
        const countryData = Country.getCountryByCode(country);
        if (countryData?.phonecode) {
            const prefix = `+${countryData.phonecode}`;
            if (!value.startsWith(prefix)) {
                value = prefix + value.replace(/^\+?\d*/, "");
            }
        }
        setPhoneNumber(value);
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!address || !pinCode || !phoneNumber || !country || !state || !city) {
            toast.error("Please fill all required fields", { position: "top-right", autoClose: 3000 });
            return;
        }

        // Validate phone (should be exactly 10 digits excluding country code)
        const countryData = Country.getCountryByCode(country);
        let localNumber = phoneNumber;

        if (countryData?.phonecode) {
            const code = `+${countryData.phonecode}`;
            if (localNumber.startsWith(code)) {
                localNumber = localNumber.slice(code.length);
            }
        }

        const digitsOnly = localNumber.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
            toast.error("Invalid phone number! It should be exactly 10 digits without country code.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        dispatch(saveShippingInfo({ address, pinCode, phoneNumber, country, state, city }));
        navigate("/order/confirm");
    };

    return (
        <>
            <PageTitle title="Shipping Info" />
            <Navbar />
            <CheckoutPath activePath={0} />
            <div className="shipping-form-container">
                <h1 className="shipping-form-header">Shipping Details</h1>
                <form className="shipping-form" onSubmit={handleSubmit}>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                placeholder="Enter your address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="pinCode">Pincode</label>
                            <input
                                type="number"
                                id="pinCode"
                                placeholder="Enter your pinCode"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="phoneNumber">Phone No</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                placeholder="Enter your Phone No"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="country">Country</label>
                            <select
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                <option value="">Select a Country</option>
                                {countries.map(c => (
                                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="shipping-form-group">
                            <label htmlFor="state">State</label>
                            <select
                                id="state"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                disabled={!states.length}
                                required
                            >
                                <option value="">Select a State</option>
                                {states.map(s => (
                                    <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="shipping-form-group">
                            <label htmlFor="city">City</label>
                            <select
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={!cities.length}
                                required
                            >
                                <option value="">Select a City</option>
                                {cities.map(c => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="shipping-submit-btn">Continue</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default Shipping;
