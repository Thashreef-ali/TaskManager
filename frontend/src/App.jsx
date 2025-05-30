import React, { useEffect, useState } from 'react'
import Login from './components/Login'
import { Outlet,  Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import SignUp from './components/SignUp'
import { Navigate } from 'react-router-dom'
import Dashbord from './pages/Dashbord'
import CompletePage from './pages/CompletePage'
import PendingPage from './pages/PendingPage'
import Profile from './components/Profile'
function App() {
  const navigate = useNavigate()
  const [currentUser,setcurrentUser] = useState(()=>{
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  })
  useEffect(()=>{
    if(currentUser){
      localStorage.setItem('currentUser',JSON.stringify(currentUser))
    }else{
      localStorage.removeItem('currentUser')
    }
  },[currentUser])
  const handleAuthsubmit =  data =>{
    const user = {
      email : data.email,
      name : data.name || 'User',
      avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User ')}&background=random`
    }
    setcurrentUser(user)
    navigate('/',{replace:true})
  }
  const handleLogout = ()=>{
    localStorage.removeItem('token');
    setcurrentUser(null)
    navigate('/login',{replace:true})
  }
const ProtectedLayout = () => (
  <Layout user={currentUser} onLogout={handleLogout}>
    <Outlet/>
  </Layout>
)

  return (
   <Routes>
    <Route path='/login' element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <Login onSubmit={handleAuthsubmit} onSwitchMode={()=>navigate('/signup')}/>
    </div>}/>

     <Route path='/signup' element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <SignUp onSubmit={handleAuthsubmit} onSwitchMode={()=>navigate('/login')}/>
    </div>}/>

       <Route element={currentUser ? <ProtectedLayout/> : <Navigate to='/login' replace/>}>
           <Route path='/' element={<Dashbord/>}/>
           <Route path='/pending' element={<PendingPage/>}/>
           <Route path='/complete' element={<CompletePage/>}/>
          <Route path='/profile' element={<Profile user={currentUser} setcurrentUser={setcurrentUser} onLogout={handleLogout}/>}/>


       </Route>
       <Route path='*' element={<Navigate to={currentUser ? '/' : '/login'} replace/>}/>
   </Routes>
  )
}

export default App