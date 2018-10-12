import React, { Component } from "react";

import PropTypes from "prop-types";

import {
  Route,
  Switch,
} from 'react-router-dom'

import { PageNotFount } from "@prisma-cms/front";

import ProductsPage from "./pages/Products"; 

import gql from "graphql-tag";
import { compose, graphql  } from "react-apollo";

import ProductView from "./view/Product";

import PrismaCmsComponent from "@prisma-cms/component";





class ProductsRouter extends PrismaCmsComponent {


  static propTypes = {
    queries: PropTypes.object.isRequired,
  }


  constructor(props) {

    super(props);

    this.prepareRouters();

  }


  prepareRouters() {


    const {
      queries: {
        productsConnection,
        createProductProcessor,
        updateProductProcessor,
      },
    } = this.props;


    this.ProductsPageRenderer = compose(
      graphql(productsConnection),
      graphql(createProductProcessor, {
        name: "createProduct",
      }),
      graphql(updateProductProcessor, {
        name: "updateProduct",
      }),
    )(ProductsPage);

    super.prepareRouters && super.prepareRouters();
  }


  render() {

    const {
      queries: {
        createProduct,
        productsConnection,
        createProductProcessor,
        updateProductProcessor,
      },
      ...other
    } = this.props;

    return <Switch >

      <Route
        exact
        path={[
          "/",
          "/products",
        ]}
        render={props => {

          const ProductsPageRenderer = this.ProductsPageRenderer;

          return <ProductsPageRenderer
            first={12}
            orderBy="createdAt_DESC"
            ProductView={ProductView}
            {...props}
          />

        }}

      />

      {/* <Route
        exact
        path="/products/:productId"
        component={ProductPage}
      /> */}


      <Route
        path="*"
        component={PageNotFount}
      />

    </Switch>;
  }

}



class ProductsConnector extends Component {

  static propTypes = {
    getQueryFragment: PropTypes.func.isRequired,
  }

  state = {}

  constructor(props) {

    super(props);

    this.prepareRouters();

  }


  prepareRouters() {

    const {
      getQueryFragment,
    } = this.props;

    const ProductNoNesting = getQueryFragment("ProductNoNestingFragment");


    const productsConnection = gql`
      query productsConnection(
        $where:ProductWhereInput
        $first: Int!
        $orderBy: ProductOrderByInput
      ){ 
        objectsConnection:productsConnection(
          where:$where
          first: $first
          orderBy: $orderBy
        ){
          edges {
            node {
              ...ProductNoNesting
            }
          }
          aggregate {
            count
          }
        } 
      }

      ${ProductNoNesting}
    `;


    const updateProductProcessor = gql`
      mutation updateProductProcessor(
        $where:ProductWhereUniqueInput!
        $data: ProductUpdateInput!
      ){ 
        response:updateProductProcessor(
          where:$where
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...ProductNoNesting
          }
        } 
      }

      ${ProductNoNesting}
    `;


    const createProductProcessor = gql`
      mutation createProductProcessor(
        $data: ProductCreateInput!
      ){ 
        response:createProductProcessor(
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...ProductNoNesting
          }
        } 
      }

      ${ProductNoNesting}
    `;


    Object.assign(this.state, {
      queries: {
        productsConnection,
        createProductProcessor,
        updateProductProcessor,
      },
    });

  }


  render() {

    const {
      queries,
    } = this.state

    const {
      ...other
    } = this.props;


    return <ProductsRouter
      queries={queries}
      {...other}
    />
  }
}


class ProductsConnectoProvider extends Component {

  static contextTypes = {
    getQueryFragment: PropTypes.func.isRequired,
  }


  render() {

    const {
      getQueryFragment,
    } = this.context;

    return <ProductsConnector
      getQueryFragment={getQueryFragment}
      {...this.props}
    />
  }
}

export default ProductsConnectoProvider;


