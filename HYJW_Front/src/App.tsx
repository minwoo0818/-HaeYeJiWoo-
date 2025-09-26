import { Navigate, Route, Routes } from "react-router-dom";
import ResponsiveAppBar from "./components/Header";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import SignUp from "./pages/SignUp";
import PostDetail from "./pages/PostDetail";
import PostListApp from "./PostListApp";
import AddPosts from "./pages/AddPosts";
import AdminPostList from "./pages/AdminPostList";
import AdminMain from "./pages/AdminMain";

function App() {
  return (
    <>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Navigate to="/posts/all" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/category/mypage" element={<MyPage />} />
        <Route path="/posts/:type" element={<PostListApp />} />
        <Route path="/addposts" element={<AddPosts />} />
        <Route path="/postdetail/:id" element={<PostDetail />} />
        <Route path="/adminpostlist" element={<AdminPostList />} />
        <Route path="/admin/main" element={<AdminMain />} />
      </Routes>
    </>
  );
}

export default App;
