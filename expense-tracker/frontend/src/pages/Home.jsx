import React from 'react'
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import './Home.css'
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
        <Header/>

        <h1 className='text-xl flex justify-center'>DITO KA PIA</h1>
    </div>
  )
}
export default Home