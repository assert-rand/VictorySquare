const validate = (formData, setErrors) => {
    const newErrors = {};
    if (!formData.email) {
        newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid.';
    }

    if (!formData.password) {
        newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

export default validate;