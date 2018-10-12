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

import PrismaCmsComponent from "@prisma-cms/component";


class ProductsConnector extends Component {

  static propTypes = {
    getQueryFragment: PropTypes.func.isRequired,
  }

  static contextTypes = {
    client: PropTypes.object.isRequired,
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
      // Renderer: ProductsRouter,
      queries: {
        // user,
        productsConnection,
        createProductProcessor,
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

    const {
      client,
    } = this.context;

    return <ProductsRouter
      queries={queries}
      client={client}
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


class ProductsRouter extends PrismaCmsComponent {


  static propTypes = {
    queries: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
  }

  // static contextTypes = {
  // }

  constructor(props) {

    super(props);

    console.log("ProductsRouter constructor");

    this.prepareRouters();

  }


  prepareRouters() {


    const {
      queries: {
        createProduct,
        productsConnection,
        createProductProcessor,
        updateProductProcessor,
      },
      client,
      ...other
    } = this.props;


    // const {
    //   client,
    // } = this.context;


    // this.QueryRender = class Test extends Component{

    //   constructor(props) {

    //     super(props);

    //     console.log("QueryRender constructor");


    //   }

    //   render(){

    //     console.log("QueryRender constructor render");

    //     return "Sdfdsf";
    //   }
    // }

    // class Test extends Component{

    //   constructor(props) {

    //     super(props);

    //     console.log("QueryRender constructor");


    //   }

    //   render(){

    //     console.log("QueryRender constructor render");

    //     return "Sdfdsf";
    //   }
    // }

    this.QueryRender = compose(
      graphql(productsConnection),
      graphql(createProductProcessor, {
        name: "createProduct",
      }),
      graphql(updateProductProcessor, {
        name: "updateProduct",
      }),
    )(ProductsPage);


    const QueryRender = <Query
      key="products"
      query={productsConnection}
      variables={{
        first: 12,
        createdAt: "DESC",
      }}
    >
      {result => this.query(result, (props => {

        const {
          // updateProduct,
          // createProduct,
          ...other
        } = props;


        return <ProductsPage
          {...props}
          updateProduct={async (options) => {

            console.log("updateProduct", options);

            const result = await client.mutate({
              mutation: updateProductProcessor,
              options,
            });

            // const result = this.mutate({
            //   mutation: updateProductProcessor,
            //   options,
            // });

            throw new Error("Asdasd");

            return result;
          }}
        />

        // return <Mutation
        //   mutation={updateProduct}
        // >{(addTodo, { data }) => (
        //   <ProductsPage
        //     {...props}
        //     updateProduct={addTodo}
        //   />
        // )}
        // </Mutation>
      }), {
          ProductView,
          // createProduct: createProductProcessor,
          // updateProduct: updateProductProcessor,
        })}
    </Query>


    super.prepareRouters && super.prepareRouters();
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
        createProductProcessor,
        updateProductProcessor,
      },
      ...other
    } = this.props;

    const {
      client,
    } = this.context;

    return <Switch >

      <Route
        exact
        path={[
          "/",
          "/products",
        ]}
        render={props => {

          const QueryRender = this.QueryRender;

          // console.log("QueryRender", QueryRender);


          return <QueryRender
            first={12}
            orderBy="createdAt_DESC"
            ProductView={ProductView}
            {...props}
            // updateProduct={event => {
            //   throw new Error("Sdfds");
            // }}
          />


          return <QueryRender
            {...props}
          />




          // const QueryRender = <Query
          //   key="products"
          //   query={productsConnection}
          //   variables={{
          //     first: 12,
          //     orderBy: "createdAt_DESC",
          //   }}
          // >
          //   {result => this.query(result, (props => {

          //     const {
          //       // updateProduct,
          //       // createProduct,
          //       ...other
          //     } = props;


          //     return <ProductsPage
          //       {...props}
          //       updateProduct={async (options) => {

          //         console.log("updateProduct", options);

          //         const result = await client.mutate({
          //           mutation: updateProductProcessor,
          //           options,
          //         });

          //         // const result = this.mutate({
          //         //   mutation: updateProductProcessor,
          //         //   options,
          //         // });

          //         throw new Error("Asdasd");

          //         return result;
          //       }}
          //     />

          //     // return <Mutation
          //     //   mutation={updateProduct}
          //     // >{(addTodo, { data }) => (
          //     //   <ProductsPage
          //     //     {...props}
          //     //     updateProduct={addTodo}
          //     //   />
          //     // )}
          //     // </Mutation>
          //   }), {
          //       ProductView,
          //       // createProduct: createProductProcessor,
          //       // updateProduct: updateProductProcessor,
          //     })}
          // </Query>

          // console.log("QueryRender constructor", QueryRender);

          // return QueryRender

        }}


      />

      {/* <Route
        exact
        path="/products/create"
        render={props => {

          return <ProductCreatePage
            mutate={createProduct}
            View={ProductView}
          />

        }}
      /> */}

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


