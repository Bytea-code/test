/* سرور استاتیک محلی برای تست سایت (بدون بک‌اند)
   اجرا: node app/tools/serve.mjs  →  http://localhost:8080
   پورت دلخواه: node app/tools/serve.mjs 8091
   ریشهٔ سرو = پوشهٔ اصلی پروژه (index.html + app/) */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', '..').split('\\').join('/');
const MIME = { html: 'text/html; charset=utf-8', css: 'text/css', js: 'text/javascript', mjs: 'text/javascript', json: 'application/json', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', webm: 'video/webm', woff2: 'font/woff2' };

http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    const norm = file.split('\\').join('/');
    if (!norm.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        // مثل گیتهاب پیجز: برای هر مسیر ناموجود، صفحهٔ 404 اختصاصی سرو شود
        const nf = path.join(ROOT, '404.html');
        if (fs.existsSync(nf)) {
            res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
            fs.createReadStream(nf).pipe(res);
        } else {
            res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
            res.end('404');
        }
        return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file).slice(1).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
}).listen(Number(process.argv[2] || process.env.PORT || 8080), '127.0.0.1', function () { console.log('bytea local: http://localhost:' + this.address().port); });