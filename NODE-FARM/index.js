const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////////////
// FILES

// Blocking, synchronous way

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written');

// // Non-blocking, asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) {
//     return console.log('ERROR');
//   }

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('File has been written!');
//       });
//     });
//   });
// });

////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((product) => replaceTemplate(tempCard, product))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);

    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });
    res.end('Page not found!');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening for requests on port 8000');
});
