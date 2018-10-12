import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import PageLayout from "@prisma-cms/front/lib/modules/pages/layout";
import Grid from '@prisma-cms/front/lib/modules/ui/Grid';

import Button from "material-ui/Button";

class ProductsPage extends PageLayout {

  static propTypes = {
    ...PageLayout.propTypes,
    ProductView: PropTypes.func.isRequired,
    updateProduct: PropTypes.func.isRequired,
    createProduct: PropTypes.func.isRequired,
  }

  static defaultProps = {
    ...PageLayout.defaultProps,
    locales: {
      ru: {
        values: {
          "Add product": "Добавить товар",
          "Cancel": "Отмена",
          "Name": "Название",
          "Product name": "Название товара",
        }
      },
    },
  }


  constructor(props){

    super(props);

    console.log("ProductsPage constructor");
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

  canEdit() {

    const {
      user: currentUser,
    } = this.context;

    const {
      sudo,
    } = currentUser || {};

    return sudo === true;
  }


  addProduct() {
    this.setState({
      newProduct: {},
    });
  }

  cancel() {
    this.setState({
      newProduct: undefined,
    });
  }


  render() {

    const {
      ProductView,
      data: {
        objectsConnection,
      },
      updateProduct,
      createProduct,
      ...other
    } = this.props;


    const {
      newProduct,
    } = this.state;


    const canEdit = this.canEdit();


    let items = objectsConnection && objectsConnection.edges.map(n => n.node) || []

    // if (canEdit) {
    //   items.unshift({});
    // }

    let form;

    if (canEdit) {

      if (newProduct) {

        items.unshift(newProduct);

        form = <Grid
          item
          xs={12}
        >
          <Button
            variant="raised"
            onClick={event => this.cancel()}
          >
            {this.lexicon("Cancel")}
          </Button>
        </Grid>

      }
      else {
        form = <Grid
          item
          xs={12}
        >
          <Button
            variant="raised"
            onClick={event => this.addProduct()}
          >
            {this.lexicon("Add product")}
          </Button>
        </Grid>
      }

    }

    return super.render(
      <div
        style={{
          marginTop: 30,
        }}
      >


        <Grid
          container
          spacing={16} 
        >

          {form}

          {items.map(n => {

            const {
              id,
            } = n;

            return <Grid
              key={id}
              item
              xs={12}
              md={6}
              lg={4}
              xl={3}
            >
              <ProductView
                lexicon={word => this.lexicon(word)}
                data={{
                  object: n,
                }}
                _dirty={!id ? {
                  name: "",
                } : undefined}
                mutate={id ? updateProduct : createProduct}
              />
            </Grid>
          })}


        </Grid>

 
      </div>
    );
  }
}


export default ProductsPage;