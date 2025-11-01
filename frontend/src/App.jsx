import React from 'react'
import Footer from './layout/Footer'
import { Outlet } from 'react-router-dom'
import Header from './layout/Header'

export default function App() {
  return (
    <div>
      <Header/>
      <Outlet/>
     <Footer/>
    </div>
  )
}
