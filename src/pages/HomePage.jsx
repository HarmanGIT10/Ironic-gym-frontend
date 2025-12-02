import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './HomePage.css';
// 1. IMPORT YOUR NEW ProductSlider COMPONENT
import ProductSlider from '../components/ProductSlider';
import shophoodie from './shop-hoodies.png';
import shopshorts from './shopshorts.jpg';
// --- Hero Slider Images ---
const heroImages = [
  "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80", // Person in black hoodie
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Man in a black hoodie in a dark gym
  "https://images.unsplash.com/photo-1548690312-e3b507d8c110?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80", // Woman in grey gym top, looking focused
];
// ------------------------------

const HomePage = () => {
  const { products: allProducts, loading, error } = useOutletContext();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide(prev => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const bestSellersData = allProducts.filter(p => p.isBestSeller);
  const hoodiesData = allProducts.filter(p => p.category === 'Hoodie');
  const teesData = allProducts.filter(p => p.category === 'Tee');
  const shortsData = allProducts.filter(p => p.category === 'Shorts');
  const accessoriesData = allProducts.filter(p => p.category === 'Accessory');

  

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <p style={{position:"absolute", left:"-9999px"}}>
  Ironic Gym offers premium gym clothing, athletic wear, and high-quality fitness gear for athletes.
</p>

      <main>
        {/* --- 1. HERO SLIDER --- */}
        <section className="relative h-[80vh] w-full overflow-hidden text-white">
          {/* Slides */}
          {heroImages.map((imgUrl, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={imgUrl}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}

          {/* Text content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
            <h1 className="text-4xl md:text-6xl font-semibold max-w-3xl mx-auto leading-tight">
              Engineered for Performance.
            </h1>
            <h1 className="text-4xl md:text-6xl font-semibold max-w-3xl mx-auto leading-tight mt-2">
              Designed for Life.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mt-6 max-w-xl">
              Performance Wear For Everyday Athletes.
            </p>
            <div className="flex justify-center items-center gap-4 mt-10">
              <a href="#hoodies" className="btn-primary px-8 py-3 rounded-full text-sm sm:text-base">
                Shop Hoodies
              </a>
              <a href="#tees" className="btn-secondary px-8 py-3 rounded-full text-sm sm:text-base">
                Explore Tees
              </a>
            </div>
          </div>

          {/* Slider Controls (Prev/Next) */}
          <button
            onClick={prevSlide}
            className="absolute z-20 top-1/2 left-4 -translate-y-1/2 bg-white/20 text-white rounded-full p-2 hover:bg-white/40 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute z-20 top-1/2 right-4 -translate-y-1/2 bg-white/20 text-white rounded-full p-2 hover:bg-white/40 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Slider Dots */}
          <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
              ></button>
            ))}
          </div>
        </section>

        {/* --- 2. SHOP CATEGORIES (REDESIGNED) --- */}
        <section id="shop-categories" className="py-16 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-medium text-gray-900 text-center mb-12">Shop by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <a href="#hoodies" className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={shophoodie} alt="Hoodies" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute inset-0 bg-transparent transition-all duration-300 group-hover:bg-black/40"></div>              <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">Hoodies</h3>
            </a>
            <a href="#tees" className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={shopshorts} alt="Tees" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute inset-0 bg-transparent transition-all duration-300 group-hover:bg-black/40"></div>              <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">Tees</h3>
            </a>
            <a href="#shorts" className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={shopshorts} alt="Shorts" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute inset-0 bg-transparent transition-all duration-300 group-hover:bg-black/40"></div>              <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">Shorts</h3>
            </a>
            <a href="#accessories" className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={shopshorts} alt="Accessories" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute inset-0 bg-transparent transition-all duration-300 group-hover:bg-black/40"></div>              <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">Accessories</h3>
            </a>
          </div>
        </section>

        {/* --- 3. PRODUCT SLIDERS (REPLACED) --- */}
       <div id="best-sellers" className="scroll-mt-24"> 
  <ProductSlider
    title="Best Sellers"
    products={bestSellersData}
    placeholderText="No best sellers found."
  />
</div>
        <ProductSlider
          title="Hoodies"
          products={hoodiesData}
          placeholderText="Coming Soon!"
        />
        <ProductSlider
          title="Tees"
          products={teesData}
          placeholderText="Coming Soon!"
        />
        <ProductSlider
          title="Shorts"
          products={shortsData}
          placeholderText="Coming Soon!"
        />
        <ProductSlider
          title="Accessories"
          products={accessoriesData}
          placeholderText="Coming Soon!"
        />

        {/* --- 4. FEATURES (MODIFIED) --- */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-900 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                <h4 className="text-lg font-medium text-gray-900">Quality Matters</h4>
                <p className="text-sm text-gray-600">Heavyweight and durable</p>
              </div>

              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-900 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A1.5 1.5 0 0118 21.75H6a1.5 1.5 0 01-1.499-1.632z" /></svg>
                <h4 className="text-lg font-medium text-gray-900">Everyday Comfort</h4>
                <p className="text-sm text-gray-600">Soft, breathable fabric</p>
              </div>

              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-900 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
                <h4 className="text-lg font-medium text-gray-900">Built to Last</h4>
                <p className="text-sm text-gray-600">Durable stitching and materials</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. EMAIL SUB (MODIFIED) --- */}
        <section className="py-20 text-center">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-medium text-gray-900">Join Our Mailing List</h3>
            <p className="mt-2 text-gray-600">Get notified about new drops and exclusive deals.</p>
            <form className="mt-6 max-w-md mx-auto flex">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input type="email" name="email-address" id="email-address" autoComplete="email" required className="flex-auto w-full bg-white border border-gray-300 rounded-l-full px-6 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" placeholder="Enter your email" />
              <button type="submit" className="btn-primary px-6 py-3 rounded-r-full text-sm sm:text-base -ml-px">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Shop</h5>
              <ul className="mt-4 space-y-3">
                <li><a href="#hoodies" className="text-base text-gray-600 hover:text-gray-900 transition-colors">Hoodies</a></li>
                <li><a href="#tees" className="text-base text-gray-600 hover:text-gray-900 transition-colors">Tees</a></li>
                <li><a href="#shorts" className="text-base text-gray-600 hover:text-gray-900 transition-colors">Shorts</a></li>
                <li><a href="#accessories" className="text-base text-gray-600 hover:text-gray-900 transition-colors">Accessories</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h5>
              <ul className="mt-4 space-y-3">
                <li><a href="mailto:ironichelpcentre@gmail.com" className="text-base text-gray-600 hover:text-gray-900 transition-colors break-all">ironichelpcentre@gmail.com</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900 transition-s">Contact Us</a></li>

              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">&copy; 2025 IRONIC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default HomePage;
