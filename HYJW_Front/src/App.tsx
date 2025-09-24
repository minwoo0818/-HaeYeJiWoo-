import { Route, Routes } from "react-router-dom";
import ResponsiveAppBar from "./components/Header";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import SignUp from "./pages/SignUp";
import PostDetail from "./pages/PostDetail";
import PostListApp from "./PostListApp";
import AddPosts from "./pages/AddPosts";

function App() {
  return (
    <>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<PostListApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/category/mypage" element={<MyPage />} />
        <Route path="/postdetail" element={<PostDetail />} />
        <Route path="/postlistapp" element={<PostListApp />} />
        <Route path="/addposts" element={<AddPosts />} />
      </Routes>
    </>
  );
}

export default App;
