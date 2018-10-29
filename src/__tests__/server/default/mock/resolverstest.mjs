
import expect from "expect";

import module from "./module";

const resolvers = module.getResolvers();

describe("Default module resolvers tests", () => {

  it("resolvers", () => {

    expect(typeof resolvers === "object").toBe(true);

  });

});

