const validateSignup = (req, res, next) => {

    const { name, email, password, address } = req.body;

    // Name Validation
    if (!name || name.length < 3 || name.length > 60) {
        return res.status(400).json({
            message: "Name must be between 20 and 60 characters"
        });
    }

    // Email Validation
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid Email Format"
        });
    }

    // Address Validation
    if (!address || address.length > 400) {
        return res.status(400).json({
            message: "Address cannot exceed 400 characters"
        });
    }

    // Password Validation
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password must be 8-16 chars with one uppercase and one special character"
        });
    }

    next();
};

module.exports = {
    validateSignup
};