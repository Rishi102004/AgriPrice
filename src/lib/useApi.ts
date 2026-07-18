import { useState, useEffect } from 'react';

export function useApi() {
  const [commodities, setCommodities] = useState<any[]>([]);
  const [mandis, setMandis] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/commodities').then(r => r.json()),
      fetch('http://localhost:5000/api/mandis').then(r => r.json()),
      fetch('http://localhost:5000/api/prices').then(r => r.json())
    ]).then(([c, m, p]) => {
      setCommodities(c);
      setMandis(m);
      setPrices(p);
      setLoading(false);
    }).catch(err => {
      console.error('API fetch error', err);
      setLoading(false);
    });
  }, []);

  const getPriceChange = (commodityId: string, mandiId: string) => {
    const cropPrices = prices.filter(p => p.commodity_id === commodityId && p.mandi_id === mandiId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (cropPrices.length < 2) return 0;
    const today = cropPrices[0].price;
    const yesterday = cropPrices[1].price;
    return ((today - yesterday) / yesterday) * 100;
  };

  return { commodities, mandis, prices, loading, getPriceChange };
}
