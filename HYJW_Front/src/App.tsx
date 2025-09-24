import { Route, Routes } from 'react-router-dom'
import './App.css'
import ResponsiveAppBar from './components/Header'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import SignUp from './pages/SignUp'

function App() {

  return (
    <>
      <ResponsiveAppBar />
      <Routes>
        {/* <Route path="/" element={<ResponsiveAppBar />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/category/mypage" element={<MyPage />} />
      </Routes>
      </>
  )
}

export default App

