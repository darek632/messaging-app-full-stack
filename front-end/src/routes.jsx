import { Navigate } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Welcome from "./pages/Welcome.jsx";
import ChatView from "./pages/ChatView.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import MyProfile from "./pages/MyProfile.jsx";



const routes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <Welcome /> },
          { path: "chats/:conversationId", element: <ChatView /> },
          { path: "search", element: <SearchResults /> },
          { path: "users/:userId", element: <UserProfile /> },
          { path: "profile", element: <MyProfile /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
];

export default routes;