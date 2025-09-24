import Logo from "./components/Logo";
import SearchBar from "./components/SearchBar";
import PostList from "./pages/PostList";
export default function PostListApp() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "60px",
        alignItems: "center",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      <Logo />
      <SearchBar />
      <PostList />
    </div>
  );
}
