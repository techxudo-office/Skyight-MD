import { useEffect, useState } from "react";
import {
    CardLayoutBody,
    CardLayoutFooter,
} from "../../../components/CardLayout/CardLayout";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Select from "../../../components/Select/Select";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";
import { addPartner, editPartner, getAllPartners } from "../../../_core/features/partnerSlice";
import { Country, City } from "country-state-city";

const initialState = {
    company_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    mobile_number: "",
    password: "",
    city: "",
    country: { label: "", value: "" },
    address: "",
    website: "",
};

const AddPartnerModal = ({ isOpen, onClose, partnerData }) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(initialState);
    const [phoneData, setPhoneData] = useState({ country_code: "", area_code: "", number: "" });
    const [mobileData, setMobileData] = useState({ country_code: "", area_code: "", number: "" });
    const { adminData } = useSelector((state) => state.persist);
    const { isCreatingPartner, isEditingPartner } = useSelector((state) => state.partner);

    const isEditing = !!partnerData;

    // Prepare list of country choices
    const countries = Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.isoCode,
    }));

    useEffect(() => {
        if (partnerData) {
            // Find the country ISO code from the country name
            const countryData = countries.find(country =>
                country.label.toLowerCase() === partnerData?.company?.country?.toLowerCase()
            );

            setFormData({
                company_name: partnerData?.company?.name || "",
                first_name: partnerData?.first_name || "",
                last_name: partnerData?.last_name || "",
                email: partnerData?.email || "",
                phone_number: partnerData?.company?.phone_number || "",
                mobile_number: partnerData?.mobile_number || "",
                password: "", // Don't prefill password for editing
                city: partnerData?.company?.city || "",
                country: countryData || { label: "", value: "" }, // Use full country object
                address: partnerData?.company?.address || "",
                website: partnerData?.company?.website || "",
            });
        } else {
            setFormData(initialState);
        }
    }, [partnerData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handlePhoneChange = (phoneInfo) => {
        setPhoneData(phoneInfo);
        const fullPhoneNumber = `+${phoneInfo.country_code}${phoneInfo.area_code}${phoneInfo.number}`;
        setFormData(prev => ({
            ...prev,
            phone_number: fullPhoneNumber
        }));
        if (errors.phone_number) {
            setErrors(prev => ({
                ...prev,
                phone_number: ""
            }));
        }
    };

    const handleMobileChange = (phoneInfo) => {
        setMobileData(phoneInfo);
        const fullMobileNumber = `+${phoneInfo.country_code}${phoneInfo.area_code}${phoneInfo.number}`;
        setFormData(prev => ({
            ...prev,
            mobile_number: fullMobileNumber
        }));
        if (errors.mobile_number) {
            setErrors(prev => ({
                ...prev,
                mobile_number: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required field validations
        if (!formData.company_name.trim()) {
            newErrors.company_name = "Company name is required";
        } else if (formData.company_name.length > 255) {
            newErrors.company_name = "Company name must be less than 255 characters";
        }

        if (!formData.first_name.trim()) {
            newErrors.first_name = "First name is required";
        } else if (formData.first_name.length > 255) {
            newErrors.first_name = "First name must be less than 255 characters";
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = "Last name is required";
        } else if (formData.last_name.length > 255) {
            newErrors.last_name = "Last name must be less than 255 characters";
        }

        // Email validation
        const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        // Phone number validation
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = "Phone number is required";
        }

        // Mobile number validation
        if (!formData.mobile_number.trim()) {
            newErrors.mobile_number = "Mobile number is required";
        }

        // Password validation (only for new partners)
        if (!isEditing) {
            if (!formData.password.trim()) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            }
        }

        // Required string fields
        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.country || !formData.country.value) {
            newErrors.country = "Country is required";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix all validation errors");
            return;
        }

        const submitData = { ...formData };

        // Extract country label from object for API
        if (submitData.country && typeof submitData.country === 'object') {
            submitData.country = submitData.country.label;
        }

        // Remove password from edit data if it's empty
        if (isEditing && !submitData.password.trim()) {
            delete submitData.password;
        }

        try {
            if (isEditing) {
                await dispatch(editPartner({
                    id: partnerData.id,
                    data: submitData,
                    token: adminData?.token
                })).unwrap();
                // Refetch partners to get updated data
                dispatch(getAllPartners({ token: adminData?.token }));
            } else {
                await dispatch(addPartner({
                    data: submitData,
                    token: adminData?.token
                })).unwrap();
                // Refetch partners to get the new partner with proper nested data
                dispatch(getAllPartners({ token: adminData?.token }));
            }
            onClose();
            setFormData(initialState);
            setErrors({});
        } catch (error) {
            console.error("Error submitting partner:", error);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={isEditing ? "Edit Partner" : "Add Partner"}
            header={isEditing ? "Edit Partner" : "Add Partner"}
            className="w-[800px]"
        >
            <form onSubmit={handleSubmit}>
                <CardLayoutBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Company Name */}
                        <Input
                            id="company_name"
                            name="company_name"
                            type="text"
                            label="Company Name *"
                            value={formData.company_name}
                            onChange={handleInputChange}
                            placeholder="Enter company name"
                            className={errors.company_name ? "mb-1" : "mb-4"}
                        />
                        {errors.company_name && (
                            <p className="text-red-500 text-sm -mt-3 mb-2 col-span-2">{errors.company_name}</p>
                        )}

                        {/* First Name */}
                        <Input
                            id="first_name"
                            name="first_name"
                            type="text"
                            label="First Name *"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                            className={errors.first_name ? "mb-1" : "mb-4"}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-sm -mt-3 mb-2">{errors.first_name}</p>
                        )}

                        {/* Last Name */}
                        <Input
                            id="last_name"
                            name="last_name"
                            type="text"
                            label="Last Name *"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            className={errors.last_name ? "mb-1" : "mb-4"}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm -mt-3 mb-2">{errors.last_name}</p>
                        )}

                        {/* Email */}
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email *"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            className={errors.email ? "mb-1" : "mb-4"}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm -mt-3 mb-2">{errors.email}</p>
                        )}

                        {/* Phone Number */}
                        <div className={errors.phone_number ? "mb-1" : "mb-4"}>
                            <PhoneNumberInput
                                id="phone_number"
                                name="phone_number"
                                label="Phone Number *"
                                value={formData.phone_number}
                                onChange={handlePhoneChange}
                                placeholder="Enter phone number"
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div className={errors.mobile_number ? "mb-1" : "mb-4"}>
                            <PhoneNumberInput
                                id="mobile_number"
                                name="mobile_number"
                                label="Mobile Number *"
                                value={formData.mobile_number}
                                onChange={handleMobileChange}
                                placeholder="Enter mobile number"
                            />
                            {errors.mobile_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.mobile_number}</p>
                            )}
                        </div>

                        {/* Password - only show for new partners */}
                        {!isEditing && (
                            <>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    label="Password *"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter password (min 8 characters)"
                                    className={errors.password ? "mb-1" : "mb-4"}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm -mt-3 mb-2">{errors.password}</p>
                                )}
                            </>
                        )}

                        {/* Country */}
                        <div className={errors.country ? "mb-1" : "mb-4"}>
                            <Select
                                id="country"
                                label="Country *"
                                options={countries}
                                value={formData.country.label || ""}
                                onChange={(option) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        country: option,
                                        city: "" // Reset city when country changes
                                    }));
                                }}
                                placeholder="Select country"
                            />
                            {errors.country && (
                                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                            )}
                        </div>

                        {/* City */}
                        <div className={errors.city ? "mb-1" : "mb-4"}>
                            <Select
                                id="city"
                                label="City *"
                                options={
                                    formData.country.value
                                        ? City.getCitiesOfCountry(
                                            formData.country.value
                                        ).map((city) => ({
                                            label: city.name,
                                            value: city.name,
                                        }))
                                        : []
                                }
                                value={formData.city}
                                onChange={(option) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        city: option.value
                                    }));
                                    if (errors.city) {
                                        setErrors(prev => ({
                                            ...prev,
                                            city: ""
                                        }));
                                    }
                                }}
                                placeholder="Select city"
                                disabled={!formData.country}
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="col-span-2">
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                label="Address *"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter full address"
                                className={errors.address ? "mb-1" : "mb-4"}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm -mt-3 mb-2">{errors.address}</p>
                            )}
                        </div>

                        {/* Website - Optional */}
                        <div className="col-span-2">
                            <Input
                                id="website"
                                name="website"
                                type="url"
                                label="Website (Optional)"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="Enter website URL"
                                className="mb-4"
                            />
                        </div>
                    </div>
                </CardLayoutBody>

                <CardLayoutFooter>
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            text="Cancel"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600"
                        />
                        <Button
                            type="submit"
                            text={isEditing ? "Update Partner" : "Add Partner"}
                            loading={isCreatingPartner || isEditingPartner}
                            className="bg-blue-500 hover:bg-blue-600"
                        />
                    </div>
                </CardLayoutFooter>
            </form>
        </ModalWrapper>
    );
};

export default AddPartnerModal;
