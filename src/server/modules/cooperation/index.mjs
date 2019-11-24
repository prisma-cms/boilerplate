
import CooperationModule from "@prisma-cms/cooperation-module";

export default class CooperationModuleCustom extends CooperationModule {

  getApiSchema(types = [], excludeTypes = []) {

    let apiSchema = super.getApiSchema(types, excludeTypes);

    apiSchema = this.cleanupApiSchema(apiSchema, [
      "TaskUpdateInput",
      "TaskReactionUpdateInput",
    ]);

    // console.log('apiSchema', apiSchema);

    return apiSchema;
  }

}
