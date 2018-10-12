
const sharp = require('sharp');
var fs = require('fs');


const resizeMax = async function (img, width, height) {
  return await img
    .metadata()
    .then(function (metadata) {

      const {
        width: originWidth,
        height: originHeight,
      } = metadata;

      // console(chalk.green());

      if (width < originWidth || height < originHeight) {

        img.max()
          .resize(width, height)
          .max()
          ;

      }

    })
}


const ImageThumbMiddleware = async (req, res, next) => {


  const {
    0: src,
    type,
  } = req.params;

  let path = `/uploads/${src}`;

  // const abthPath = __dirname + path;
  const abthPath = process.cwd() + path;


  if (fs.existsSync(abthPath)) {


    const img = await sharp(abthPath)

    switch (type) {

      case 'origin':
        break;

      case 'avatar':

        img
          .resize(200, 200);

        break;



      case 'thumb':

        img
          .resize(150, 150)
          .crop(sharp.gravity.north);

        break;


      case 'small':

        img
          .resize(200, 160)
          .max()
          .crop();

        break;


      case 'middle':

        img
          .resize(600, 420)
          .max()
          .crop();

        break;


      case 'big':

        img.max();
        resizeMax(img, 1200, 100);

        break;


      default:

        res.status(500);
        res.send(`Wrong image type '${type}'`);

    }

    await img
      .withMetadata()
      // .toFormat('jpeg', {
      //   quality: 100,
      // })
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {

        const {
          format,
        } = info;

        res.status(200);
        res.contentType(`image/${format}`);
        res.setHeader("Cache-Control", "public, max-age=2592000");
        res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
        res.send(data);

      })
      .catch(e => {
        console.error(e);

        res.status(500);
        res.send(e);

      });

  }
  else {
    console.error("File not exists");

    res.status(404).send('File not found');
  }


}

module.exports = ImageThumbMiddleware;