import fetch from 'node-fetch';

(async ()=>{
  try {
    const res = await fetch('http://localhost:3001/api/food-items');
    const data = await res.json();
    console.log('FOOD ITEMS:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('FETCH ERROR:', err);
  }
})();
