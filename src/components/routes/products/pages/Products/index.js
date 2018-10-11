import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import PageLayout from "@prisma-cms/front/lib/modules/pages/layout";
import Grid from '@prisma-cms/front/lib/modules/ui/Grid';

class ProductsPage extends PageLayout {

  static propTypes = {
    ...PageLayout.propTypes,
    ProductView: PropTypes.func.isRequired,
    updateProduct: PropTypes.func.isRequired,
  }

  // static propTypes = {

  // };

  // componentDidMount() {

  //   console.log("ProductsPage componentDidMount");
  // }

  // componentDidUpdate() {

  //   console.log("ProductsPage componentDidUpdate");
  // }

  setPageMeta() {

    return super.setPageMeta({
      title: "Products",
    });
  }


  render() {

    const {
      ProductView,
      data: {
        objectsConnection,
      },
      updateProduct,
      ...other
    } = this.props;


    const items = objectsConnection && objectsConnection.edges.map(n => n.node) || []

    return super.render(
      <div>

        <Grid
          container
          spacing={16}
        >

          {items.map(n => {

            const {
              id,
            } = n;

            return <Grid
              key={id}
              item
              xs={6}
            >
              <ProductView 
                data={{
                  object: n,
                }}
                mutate={updateProduct}
              />
            </Grid>
          })}


        </Grid>


        <Link
          to="/products/create"
        >
          Create product page
      </Link>
      </div>
    );
  }
}


export default ProductsPage;