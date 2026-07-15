import HeroBanner from "@/components/HeroBanner";
import FeaturedCategories from "@/components/FeaturedCategories";
import TrendingProducts from "@/components/TrendingProducts";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import WhyShopWithUs from "@/components/WhyShopWithUs";
import NewsletterSection from "@/components/NewsletterSection";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <TrendingProducts />
      <FlashSaleBanner />
      <WhyShopWithUs />
      <NewsletterSection />
    </>
  );
}
