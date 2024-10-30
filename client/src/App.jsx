import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Components/signup';
import Login from './Components/login'
import Home from './Components/home'
import ForgetPassword from './Components/forgetPassword'
import ResetPassword from './Components/resetPassword'
import List from './Components/list'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/list" element={<List />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
