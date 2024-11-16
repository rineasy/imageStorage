import React from 'react'
import Hero from './components/hero'
import Register from './components/register'
import Footer from './components/footer'
import Pricing from './components/pricing'

const MainPage = () => {
  return (
    <div className='bg-base-100 min-h-screen'>
      <Hero />
      <Pricing />
      <Register />
      <Footer />
    </div>
  )
}

export default MainPage