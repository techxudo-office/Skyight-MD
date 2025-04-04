export const updateAccountValidation = (password, fullName) => {
  const errors = [];
  password = password.trim();
  fullName = fullName.trim();
  if (!fullName) errors.push("Full name is required");
  else if (fullName.length < 3)
    errors.push("Full name must be at least 3 characters long");
  if (!password) errors.push("Password is required");
  else {
    if (password.length < 8)
      errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password))
      errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password))
      errors.push("Password must contain at least one lowercase letter");
    if (!/\d/.test(password))
      errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*]/.test(password))
      errors.push(
        "Password must contain at least one special character (!@#$%^&*)"
      );
  }
  return errors.length ? errors.join("\n") : null;
};

export const userValidation = (form, setErrors) => {
  let newErrors = {};

  if (!form.first_name.trim()) newErrors.first_name = "First name is required";

  if (!form.last_name.trim()) newErrors.last_name = "Last name is required";

  if (!form.mobile_number.trim()) {
    newErrors.mobile_number = "Mobile number is required";
  } else if (!/^\d{10}$/.test(form.mobile_number)) {
    newErrors.mobile_number = "Mobile number must be 10 digits";
  }

  if (!form.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = "Invalid email format";
  }

  if (!form?.password?.trim()) {
    newErrors.password = "Password is required";
  } else if (form.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(form.password)) {
    newErrors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(form.password)) {
    newErrors.password = "Password must contain at least one lowercase letter";
  } else if (!/\d/.test(form.password)) {
    newErrors.password = "Password must contain at least one number";
  } else if (!/[!@#$%^&*]/.test(form.password)) {
    newErrors.password =
      "Password must contain at least one special character (!@#$%^&*)";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const adminValidation = (form, setErrors) => {
  let newErrors = {};

  if (!form.full_name.trim()) newErrors.full_name = "Full name is required";

  if (!form.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = "Invalid email format";
  }

  if (!form?.password?.trim()) {
    newErrors.password = "Password is required";
  } else if (form.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(form.password)) {
    newErrors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(form.password)) {
    newErrors.password = "Password must contain at least one lowercase letter";
  } else if (!/\d/.test(form.password)) {
    newErrors.password = "Password must contain at least one number";
  } else if (!/[!@#$%^&*]/.test(form.password)) {
    newErrors.password =
      "Password must contain at least one special character (!@#$%^&*)";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const ticketValidation = (form, setErrors) => {
  let newErrors = {};

  if (!form.title.trim()) newErrors.title = "Title is required";
  if (!form.description.trim()) newErrors.description = "Description name is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
