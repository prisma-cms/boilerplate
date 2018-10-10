import React, { Component } from "react";

import PropTypes from "prop-types";

import {
  Route,
  Switch,
} from 'react-router-dom'

import { PageNotFount } from "@prisma-cms/front";

import ProductsPage from "./pages/Products";
import ProductPage from "./pages/Product";
import ProductCreatePage from "./pages/ProductCreate";
import gql from "graphql-tag";
import { compose, graphql, Query, Mutation } from "react-apollo";

import CircularProgress from 'material-ui/Progress/CircularProgress';

import ProductView from "./view/Product";



class ProductsConnector extends Component {

  static propTypes = {
    getQueryFragment: PropTypes.func.isRequired,
  }

  state = {}


  prepareQuery() {

    const {
      getQueryFragment,
    } = this.props;

    // const UserNoNestingFragment = getQueryFragment("UserNoNestingFragment");
    const ProductNoNesting = getQueryFragment("ProductNoNestingFragment");


    const productsConnection = gql`
      query productsConnection(
        $where:ProductWhereInput
        $first: Int!
      ){ 
        objectsConnection:productsConnection(
          where:$where
          first: $first
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


    Object.assign(this.state, {
      // Renderer: ProductsRouter,
      queries: {
        // user,
        productsConnection,
        updateProductProcessor,
      },
    });

  }

  componentWillMount() {

    this.prepareQuery();

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


class ProductsRouter extends Component {


  static propTypes = {
    queries: PropTypes.object.isRequired,
  }


  query(result, Component, options) {

    const { loading, error, data } = result;


    if (error) return "Error"

    if (loading || !data) return <CircularProgress />

    return <Component
      {...result}
      {...options}
    />
  }


  render() {

    const {
      queries: {
        createProduct,
        productsConnection,
        updateProductProcessor,
      },
      ...other
    } = this.props;

    return <Switch >

      <Route
        exact
        path="/products"
        render={props => {
          return <Query
            query={productsConnection}
            variables={{
              first: 12,
            }}
          >
            {result => this.query(result, (props => {

              const {
                updateProduct,
                ...other
              } = props;

              return <Mutation
                mutation={updateProduct}
              >{(addTodo, { data }) => (
                <ProductsPage
                  {...props}
                  updateProduct={addTodo}
                />
              )}
              </Mutation>
            }), {
                ProductView,
                updateProduct: updateProductProcessor,
              })}
          </Query>

        }}
      />

      <Route
        exact
        path="/products/create"
        render={props => {

          return <ProductCreatePage
            mutate={createProduct}
            View={ProductView}
          />

        }}
      />

      <Route
        exact
        path="/products/:productId"
        component={ProductPage}
      />


      <Route
        path="*"
        component={PageNotFount}
      />

    </Switch>;
  }

}



// routers.unshift({
//   exact: true,
//   path: "/products/:productId",
//   render: props => this.renderProductPage(props),
// });

// routers.unshift({
//   exact: true,
//   path: "/products/create",
//   render: props => this.renderProductCreatePage(props),
// });

// routers.unshift({
//   exact: true,
//   path: "/products",
//   render: props => this.renderProductsPage(props),
// });



export default ProductsConnectoProvider;


