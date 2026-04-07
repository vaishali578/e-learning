const logout = (navigate)=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("theme");

    navigate("/auth/login");
}

export default logout;