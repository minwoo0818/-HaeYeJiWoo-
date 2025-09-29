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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useAuthStore } from "../authStore";

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [adminAnchorEl, setAdminAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminAnchorEl(event.currentTarget);
  };
  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
  };

  const handleClick = (path: To) => {
    navigate(path);
    handleCloseNavMenu();
    handleAdminMenuClose();
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const { logout } = useAuthStore();
  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwt");
    logout();
    navigate("/login");
  };

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navItems = [
    { name: "게임", path: "/posts/GAME" },
    { name: "맛집", path: "/posts/GOOD_RESTAURANT" },
    { name: "유머", path: "/posts/HUMOR" },
    { name: "일상", path: "/posts/DAILY_LIFE" },
    ...(isAuthenticated
      ? [{ name: "마이페이지", path: "/category/mypage" }]
      : []),
  ];

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#474747", width: "100vw" }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
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

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              PaperProps={{ sx: { minWidth: 220, paddingY: 1.5 } }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.name}
                  onClick={() => handleClick(item.path)}
                >
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

          {/* 로그인 / 로그아웃 + 관리자 버튼 */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            {isAuthenticated && (
              <>
                {/* ✅ 관리자 버튼 먼저 */}
                <Button
                  variant="outlined"
                  onClick={handleAdminMenuOpen}
                  sx={{
                    mr: 2,
                    backgroundColor: "#fff",
                    color: "#747474",
                    borderColor: "#747474",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                      borderColor: "#747474",
                    },
                  }}
                  endIcon={<ArrowDropDownIcon />}
                >
                  관리자
                </Button>

                <Menu
                  anchorEl={adminAnchorEl}
                  open={Boolean(adminAnchorEl)}
                  onClose={handleAdminMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={() => handleClick("/admin/main")}>
                    관리자 메인
                  </MenuItem>
                  <MenuItem onClick={() => handleClick("/admin/table")}>
                    데이터 조회
                  </MenuItem>
                  <MenuItem onClick={() => handleClick("/admin/postlist")}>
                    삭제이력 관리
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* ✅ 로그인 또는 로그아웃 버튼 뒤에 배치 */}
            {!isAuthenticated ? (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLoginClick}
                sx={{ mr: 2 }}
              >
                로그인
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogoutClick}
                sx={{ mr: 2 }}
              >
                로그아웃
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
