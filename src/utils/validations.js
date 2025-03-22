export const updateAccountValidation = (password, fullName) => {
    const errors = [];
    password = password.trim();
    fullName = fullName.trim();
    if (!fullName) errors.push("Full name is required");
    else if (fullName.length < 3) errors.push("Full name must be at least 3 characters long");
    if (!password) errors.push("Password is required");
    else {
        if (password.length < 8) errors.push("Password must be at least 8 characters long");
        if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
        if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
        if (!/\d/.test(password)) errors.push("Password must contain at least one number");
        if (!/[!@#$%^&*]/.test(password)) errors.push("Password must contain at least one special character (!@#$%^&*)");
    }
    return errors.length ? errors.join("\n") : null;
};
