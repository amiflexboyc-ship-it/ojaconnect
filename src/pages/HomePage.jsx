import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import LagosMap from '../components/LagosMap';
import NearbyFinder from '../components/NearbyFinder';
import SellerCTA from '../components/SellerCTA';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <ProductGrid />
      <LagosMap />
      <NearbyFinder />
      <SellerCTA />
    </main>
  );
}
