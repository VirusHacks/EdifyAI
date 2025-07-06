import React from 'react'

import About from './_components/About'
import Features from './_components/Features'
import Contact from './_components/Contact'
import Footer from './_components/Footer'
import Story from './_components/Story'
import Hero from './_components/Hero'
import './index.css'

const page = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <Hero />
      <About />
      <Features />
      <Story />
      <Contact />
      <Footer />
    </main>
  )
}

export default page
