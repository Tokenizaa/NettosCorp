const fs = require('fs');
const spec = JSON.parse(fs.readFileSync(0, 'utf-8'));
Object.entries(spec.paths).forEach(([p, methods]) => {
  Object.keys(methods).forEach(m => {
    if (p.includes('/issues') && !p.includes('{')) {
      console.log(m.toUpperCase().padEnd(6), p);
    }
  });
});