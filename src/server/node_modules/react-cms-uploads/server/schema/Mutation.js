const { createWriteStream, unlinkSync } = require('fs')
const all = require('promises-all').all
const mkdirp = require('mkdirp')
const shortid = require('shortid')
// const lowdb = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')
// const { GraphQLUpload } = require('apollo-upload-server')

const uploadDir = 'uploads';

const {
  getUserId,
} = require('react-cms-graphql-utils/src/auth');

// const db = lowdb(new FileSync('db.json'))

// // Seed an empty DB
// db.defaults({ uploads: [] }).write()

// Ensure upload directory exists
mkdirp.sync(uploadDir)

const storeFS = ({ stream, filename }) => {
  const id = shortid.generate()
  
  const path = `${uploadDir}/${id}-${filename}`
  
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file
          unlinkSync(path)
        reject(error)
      })
      .on('end', () => resolve({ id, path }))
      .pipe(createWriteStream(path))
  )
}

// const storeDB = file =>
//   db
//     .get('uploads')
//     .push(file)
//     .last()
//     .write()

const processUpload = async (upload, ctx, info) => {

  // console.log('processUpload', upload);

  // return;

  const userId = getUserId(ctx)

  const { stream, filename, mimetype, encoding } = await upload
  const { id, path } = await storeFS({ stream, filename })
  // return storeDB({ id, filename, mimetype, encoding, path })

  // const file = { id, filename, mimetype, encoding, path };

  let file;

  if(path){

    file = { 
      filename, 
      mimetype, 
      encoding, 
      path: path.replace(/^\.\//, ''),
      createdby:{
        connect: {
          id: userId,
        }
      }
    };
  
    // console.log('processUpload file', file);

    return ctx.db.mutation.createFile({
      data: file,
    }, info);
  }

  // else 
  return null;

}

module.exports = {
  // Upload: GraphQLUpload,
  // Query: {
  //   uploads: () => db.get('uploads').value()
  // },
  Mutation: {
    // singleUpload: (obj, { file }) => {
    async singleUpload(parent, args, ctx, info){

      const {
        file: upload,
      } = args;

      return await processUpload(upload, ctx, info);

      // if(file){

      //   return ctx.db.mutation.createFile({
      //     data: file,
      //   }, info);
      // }

      // return null;

    },
    // multipleUpload: async (obj, { files }) => {
    multipleUpload: async (parent, args, ctx, info) => {

      const {
        files,
      } = args;

      let { resolve, reject } = await all(files.map(upload => {
        return processUpload(upload, ctx, info);
      }));

      if (reject.length){
        reject.forEach(({ name, message }) =>
          // eslint-disable-next-line no-console
          console.error(`${name}: ${message}`)
        )
      }

      // console.log('resolve', resolve);

      resolve = (resolve && resolve
        // .map(n => {

        //   const {
        //     createFile: file,
        //   } = (n && n.data) || {};

        //   return file || null;

        // })
        .filter(n => n)
      ) || null;

      // console.log('resolve 2', resolve);

      // if(resolve && resolve.length){
      //   return;
      // }

      // // else 
      // return null;

      return resolve;
    }
  }
}
