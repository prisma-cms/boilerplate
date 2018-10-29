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
]
 


describe('Verify prisma Schema', () => {

  verifySchema(module.getSchema(), requiredTypes);

});


describe('Verify API Schema', () => {

  verifySchema(module.getApiSchema(), requiredTypes);

});

