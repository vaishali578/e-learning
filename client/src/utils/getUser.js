export const getUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user;
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
    return {};
  }
};

// Optional: capitalize first letter
export const getUserName = () => {
  const user = getUser();
  if (!user.name) return "User";
  return user.name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

// Optional: get role
export const getUserRole = () => {
  const user = getUser();
  return user.role || "student";
};
