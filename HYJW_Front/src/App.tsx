import { Navigate, Route, Routes } from "react-router-dom";
import ResponsiveAppBar from "./components/Header";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import SignUp from "./pages/SignUp";
import PostDetail from "./pages/PostDetail";
import PostListApp from "./PostListApp";
import AddPosts from "./pages/AddPosts";
import AdminPostList from "./pages/AdminPostList";

function App() {
  return (
    <>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Navigate to="/posts/all" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/category/mypage" element={<MyPage />} />
        <Route path="/postdetail" element={<PostDetail />} />
        <Route path="/posts/:type" element={<PostListApp />} />
        <Route path="/addposts" element={<AddPosts />} />
        <Route path="/adminpostlist" element={<AdminPostList />} />
      </Routes>
    </>
  );
}

export default App;
