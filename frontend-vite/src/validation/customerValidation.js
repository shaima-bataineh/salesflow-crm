export const validateCustomer = (customer) => {
  const errors = {};

  // الاسم: لازم لا يقل عن 3 حروف
  if (!customer.name || customer.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  // الايميل: تحقق بسيط للصيغة
  if (!customer.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
    errors.email = "Email is invalid";
  }

  // الهاتف: لازم لا يقل عن 6 أرقام
  if (!customer.phone || customer.phone.trim().length < 9) {
    errors.phone = "Phone must be at least 9 digits";
  }

  // الشركة: يمكن تركها فاضية أو تحقق إذا تحبي
  if (!customer.company || customer.company.trim().length < 2) {
    errors.company = "Company must be at least 2 characters";
  }

  // الموقع: يمكن تركه فاضي أو تحقق
  if (!customer.location || customer.location.trim().length < 4) {
    errors.location = "Location must be at least 2 characters";
  }

  return errors;
};