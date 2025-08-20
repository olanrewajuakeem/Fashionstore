import React from "react";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";

import BrowseCategoriesCarousel from "./components/BrowseCategoriesCarousel";

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSlider />
      <BrowseCategoriesCarousel />
      {/* Later: More sections like Categories, Products, Footer */}
    </div>
  );
}

export default App;
