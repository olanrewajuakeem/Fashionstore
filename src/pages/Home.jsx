import HeroSlider from "../components/HeroSlider";
import BrowseCategoriesCarousel from "../components/BrowseCategoriesCarousel";
import DiscountsSection from "../components/DiscountsSection";
import PromoBanner from "../components/PromoBanner";
import BestSellers from "../components/BestSellers";
import About from "../components/About";
import Contact from "../components/Contact";
import Newsletter from "../components/Newsletter";

const Home = () => {
  return (
    <div>
      <HeroSlider />
      <BrowseCategoriesCarousel />
      <DiscountsSection />
      <PromoBanner />
      <BestSellers />
      <div id="about">
        <About />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <div id="blog">
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
