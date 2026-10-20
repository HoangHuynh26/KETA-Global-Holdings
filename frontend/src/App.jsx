import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import TrustBar from './components/TrustBar/TrustBar';
import Services from './components/Services/Services';
import WhyVietnam from './components/WhyVietnam/WhyVietnam';
import B2BShowcase from './components/B2BShowcase/B2BShowcase';
import Founder from './components/Founder/Founder';
import BusinessForm from './components/BusinessForm/BusinessForm';
import Footer from './components/Footer/Footer';
import SEOHead from './components/SEO/SEOHead';
import BackToTop from './components/BackToTop/BackToTop';
import ShowcaseAdmin from './components/ShowcaseAdmin/ShowcaseAdmin';
import './App.css';

export default function App() {
  const getIsShowcaseRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path === '/showcase' ||
      path.startsWith('/showcase/') ||
      hash === '#/showcase' ||
      hash === '#showcase'
    );
  };

  const [isShowcaseAdmin, setIsShowcaseAdmin] = useState(getIsShowcaseRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsShowcaseAdmin(getIsShowcaseRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setIsShowcaseAdmin(getIsShowcaseRoute());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isShowcaseAdmin) {
    return (
      <div className="app-wrapper admin-view">
        <SEOHead />
        <ShowcaseAdmin onBackToHome={() => navigateTo('/')} />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <SEOHead />
      <Header />
      <main className="main-content">
        <Hero />
        <TrustBar />
        <Services />
        <WhyVietnam />
        <B2BShowcase />
        <Founder />
        <BusinessForm />
      </main>
      <Footer onGoToShowcaseAdmin={() => navigateTo('/showcase')} />
      <BackToTop />
    </div>
  );
}
