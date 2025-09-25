import React from "react";
import { useNavigate, type To } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
// import "../Header.css";

const navItems = [
  { name: "게임", path: "/posts/GAME" },
  { name: "맛집", path: "/posts/GOOD_RESTAURANT" },
  { name: "유머", path: "/posts/HUMOR" },
  { name: "일상", path: "/posts/DAILY_LIFE" },
  { name: "마이페이지", path: "/category/mypage" }, // 항상 보여줌
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClick = (path: To) => {
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#474747", width: "95vw" }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center"  }}
        >
          {/* 햄버거 메뉴 */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {/* 모바일 메뉴 */} 
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              PaperProps={{
                sx: {
                  minWidth: 220,
                  paddingY: 1.5,
                },
              }}
            >
              {navItems.map((item) => (
                <MenuItem key={item.name} onClick={() => handleClick(item.path)}> 
                  <Typography textAlign="center">{item.name}</Typography> 
                </MenuItem> 
              ))}
            </Menu> 
          </Box>

          {/* 로고 */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 4,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            HYJW
          </Typography>

          {/* 데스크탑 메뉴 */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleClick(item.path)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* 로그인 버튼 (오른쪽 정렬) */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => handleClick("/login")}
              sx={{ ml: 2 }}
            >
              로그인
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
