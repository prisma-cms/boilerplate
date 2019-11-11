
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class GalleryFileProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "GalleryFile";

    this.private = true;
    this.ownable = true;
  }


  async create(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }
}


export default class GalleryFileModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return GalleryFileProcessor;
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
        galleryFile: (source, args, ctx, info) => {
          return ctx.db.query.galleryFile(args, info);
        },
        galleryFiles: (source, args, ctx, info) => {
          return ctx.db.query.galleryFiles(args, info);
        },
        galleryFilesConnection: (source, args, ctx, info) => {
          return ctx.db.query.galleryFilesConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createGalleryFileProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("GalleryFile", args, info);
        },
        updateGalleryFileProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("GalleryFile", args, info);
        },
        deleteGalleryFile: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("GalleryFile", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        galleryFile: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.galleryFile({}, info);
          },
        },
      },
      GalleryFileResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.galleryFile({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}