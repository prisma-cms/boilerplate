import chalk from "chalk";

import TestModule from "./module";

import { parse, print } from 'graphql';

import expect from 'expect'


import {
  verifySchema,
}  from "../schema.test";
 

import mocha from 'mocha'
const { describe, it } = mocha


const module = new TestModule();


const requiredTypes = [
  {
    name: "Query",
    fields: {
      both: [
        "testUsers",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "Mutation",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "TestUser",
    fields: {
      both: [
        "testUsername",
      ],
      prisma: [
        "prismaTestUsername",
      ],
      api: [
        "apiTestUsername",
      ],
    },
  },
  {
    name: "TestUserCreateInput",
    fields: {
      api: [
        "testUsername",
      ],
    },
  },
  {
    name: "TestEnumFields",
    fields: {
      both: [
      ],
      api: [
        "TestField",
      ],
      prisma: [
      ],
    },
  },
]
 


describe('Verify prisma Schema', () => {

  verifySchema(module.getSchema(), requiredTypes);

});


describe('Verify API Schema', () => {

  verifySchema(module.getApiSchema(), requiredTypes);

});

