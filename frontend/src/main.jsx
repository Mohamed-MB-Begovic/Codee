import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Voting from './pages/Voting.jsx'
import Login from './pages/Login.jsx'
import { Toaster } from 'react-hot-toast'
import { ContextProvider } from './context/UserContext.jsx'
import Home from './pages/Home.jsx'
import Results from './pages/Results.jsx'
import AdminHome from './admin/AdminHome.jsx'
import Dashbourd from './admin/Dashbourd.jsx'
import Candidates from './admin/Candidates.jsx'
import Users from './admin/Users.jsx'
import Elections from './admin/Elections.jsx'
import About from './pages/About.jsx'
import Settings from './admin/Settings.jsx'
import ManagerDashbourd from './manager/ManagerDashbourd.jsx'
import ManagerHome from './manager/ManagerHome.jsx'
import ManagerUsers from './manager/ManagerUsers.jsx'
import ManagerSettings from './manager/ManagerSettings.jsx'
import ContactUs from './pages/ContactUs.jsx'
const rooot=createBrowserRouter([
  { path:"/",element:<App/>,children:[
    {index:true,element:<Home/>},
    {path:"/voting",element:<Voting/> },
    {path:"/home",element:<Home/> },
    {path:"/results",element:<Results/> },
  {path:"/about",element:<About/> },
  ]},  
{ path:"/admin",element:<AdminHome/>,children:[
    {index:true,element:<Dashbourd/>},
    {path:'candidates',element:<Candidates/>},
    {path:'users',element:<Users/>},
    {path:'settings',element:<Settings/>},
    {path:'elections',element:<Elections/>}
  //     {path:"/voting",element:<Voting/> },
  // {path:"/home",element:<Home/> },
  // {path:"/results",element:<Results/> },
  ]},  
  {
    path:"/manager",element:<ManagerHome/>,children:[
      {index:true,element:<ManagerDashbourd/>},
      {path:'users',element:<ManagerUsers/>},
      {path:'settings',element:<ManagerSettings/>},
    ]
  },
  {path:"/login",element:<Login/> },
  {path:"/contact-us",element:<ContactUs/> },
  {path:"*",
    element:
    <div className='flex items-center justify-center h-screen text-3xl font-bold'>404 | Page Not Found</div>  }
])
createRoot(document.getElementById('root')).render(
    <ContextProvider>
  <StrictMode>
    <Toaster/>
    <RouterProvider router={rooot}/>
  </StrictMode>
    </ContextProvider>
)
