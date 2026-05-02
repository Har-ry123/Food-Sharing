import fetch from 'node-fetch';

(async ()=>{
  try {
    const res = await fetch('http://127.0.0.1:3001/api/debug/add-sample', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Scripted Debug Item', description: 'From post-debug.js', location: 'Local' })
    });
    const j = await res.json();
    console.log('ADDED:', j);
  } catch (e) {
    console.error('ERR', e);
  }
})();
