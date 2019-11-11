
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class GalleryProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "Gallery";

    this.private = true;
    this.ownable = true;
  }


  async create(method, args, info) {

    if (args.data) {

      let {
        // name = null,
        ...data
      } = args.data;


      Object.assign(data, {
        // name,
      });

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {


    if (args.data) {

      const {
        // db,
        currentUser,
      } = this.ctx;


      const {
        id: currentUserId,
      } = currentUser || {};


      let {
        data: {
          name,
          GalleryFiles,
          ...data
        },
        // where
      } = args;


      // const Gallery = where ? await db.query.gallery({
      //   where,
      // }) : null;


      // console.log("Gallery", JSON.stringify(Gallery, true, 2));


      if (name !== undefined) {

        name = name ? name.trim() : null;

        if (!name) {
          this.addFieldError("name", "Не заполнено название");
        }

      }


      if (GalleryFiles) {

        const {
          connect,
        } = GalleryFiles;

        // console.log("GalleryFiles", JSON.stringify(GalleryFiles, true, 2));

        if (connect) {

          Object.assign(data, {
            Files: {
              create: connect.map(n => {

                return {
                  File: {

                    connect: n,
                  },
                  CreatedBy: {
                    connect: {
                      id: currentUserId,
                    },
                  },
                }
              }),
            },
          });

        }

      }


      Object.assign(data, {
        name,
      });

      args.data = data;

      // console.log("data", JSON.stringify(data, true, 2));

    }

    // return false;

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }
}


export default class GalleryModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return GalleryProcessor;
  }


  getResolvers() {

    const {
      Query: {
        ...Query
      },
      Subscription: {
        ...Subscription
      },
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
        gallery: (source, args, ctx, info) => {
          return ctx.db.query.gallery(args, info);
        },
        galleries: (source, args, ctx, info) => {
          return ctx.db.query.galleries(args, info);
        },
        galleriesConnection: (source, args, ctx, info) => {
          return ctx.db.query.galleriesConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createGalleryProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("Gallery", args, info);
        },
        updateGalleryProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("Gallery", args, info);
        },
        deleteGallery: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("Gallery", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        gallery: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.gallery({}, info);
          },
        },
      },
      GalleryResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.gallery({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}