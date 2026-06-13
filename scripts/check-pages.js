const http = require('http');
const urls = ['/trends','/competitors'];
const host = 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT,10) : 3001;

(async ()=>{
  for (const u of urls) {
    await new Promise((done) => {
      const req = http.get({ hostname: host, port, path: u }, (res) => {
        console.log(u, res.statusCode);
        res.resume();
        res.on('end', done);
      });
      req.on('error', (err) => {
        console.log(u, 'ERR', err.message);
        done();
      });
    });
  }
})().catch((err) => { console.error(err); process.exit(1); });
