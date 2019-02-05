
const PrismaProxy = require("@prisma-cms/front/lib/setupProxy");

var proxy = require('http-proxy-middleware');

const cwd = process.cwd();

module.exports = function (app) {

  app.get("/voyager.worker.js", (req, res, next) => {
    res.sendFile(`${cwd}/node_modules/@prisma-cms/graphql-voyager/dist/voyager.worker.js`);
  });

  app.use(proxy('/socket.io/', {
    target: 'http://localhost:9001',
    ws: true,
  }));

  app.get("/media/call.mp3", (req, res, next) => {
    res.sendFile(`${cwd}/node_modules/@prisma-cms/webrtc/public/media/call.mp3`);
  });

  PrismaProxy(app);

};

// module.exports = PrismaProxy;