import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

// | #  | Feature              | Kya karta hai                  | Real Use Case          |
// | -- | -------------------- | ------------------------------ | ---------------------- |
// | 1  | `<BrowserRouter>`    | Routing enable karta hai       | SPA navigation         |
// | 2  | `<Routes>`           | Saare routes ko wrap karta hai | Route matching         |
// | 3  | `<Route>`            | Single route define karta hai  | Page mapping           |
// | 4  | `element` prop       | Component render karta hai     | v6 syntax              |
// | 5  | No `exact`           | Auto exact matching            | Clean routes           |
// | 6  | `<Link>`             | Reload bina page change        | Navbar links           |
// | 7  | `useNavigate()`      | JS se redirect                 | Login ke baad redirect |
// | 8  | `useParams()`        | URL param read                 | `/course/:id`          |
// | 9  | `useLocation()`      | Current route info             | Active menu            |
// | 10 | `useSearchParams()`  | Query params handle            | Pagination, filters    |
// | 11 | Nested Routes        | Route ke andar route           | Dashboard layout       |
// | 12 | `<Outlet>`           | Child route render             | Layout system          |
// | 13 | `<Navigate>`         | Conditional redirect           | Auth guard             |
// | 14 | Protected Routes     | Route access control           | Auth / Role based      |
// | 15 | Route Ranking        | Best match auto select         | No conflict            |
// | 16 | Layout Routes        | Common UI structure            | Sidebar / Header       |
// | 17 | Index Routes         | Default child route            | `/dashboard`           |
// | 18 | Dynamic Routes       | URL based routing              | User / Course detail   |
// | 19 | Lazy Loading         | Component lazy load            | Performance boost      |
// | 20 | `useRoutes()`        | Config based routing           | Large apps             |
// | 21 | Error Routes         | Invalid route handling         | 404 pages              |
// | 22 | Relative Links       | Short link paths               | Nested nav             |
// | 23 | Programmatic Routing | Logic based nav                | API success flow       |
// | 24 | Data Passing         | State with navigate            | Temp data share        |
