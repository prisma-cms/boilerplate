import React, { Component } from 'react';
import PropTypes from 'prop-types';


import EditableView from 'apollo-cms/lib/DataView/Object/Editable';
import { Paper } from 'material-ui';
import { withStyles } from 'material-ui';
import Grid from '@prisma-cms/front/lib/modules/ui/Grid';

// import Span from '@prisma-cms/ui';

// import SingleUploader from '@prisma-cms/front/lib/modules/react-cms-uploads/src/components/uploader/SingleUploader';
import Typography from 'material-ui/Typography';

import { Uploader } from "@prisma-cms/ui";
import { Image } from "@prisma-cms/ui";


export const styles = theme => {

  // console.log("theme", theme);

  const {
    palette: {
      grey,
    },
  } = theme;

  return {
    root: {
      padding: 15,
    },
    image: {
      width: "100%",
    },
    noImage: {
      width: "100%",
      paddingTop: "26%",
      paddingBottom: "26%",
      backgroundColor: grey[300],
      textAlign: "center",
    },
    uploader: {
      "&.fullWidth": {
        width: "100%",
        maxWidth: "100%",
      },
    },
  }
}

class Product extends EditableView {


  static propTypes = {
    ...EditableView.propTypes,
    classes: PropTypes.object.isRequired,
    lexicon: PropTypes.func.isRequired,
  }

  constructor(props){

    super(props);

    console.log("Product constructor");
  }


  lexicon(word) {
    const {
      lexicon,
    } = this.props;

    return lexicon(word);
  }

  canEdit() {

    const currentUser = this.getCurrentUser();


    const {
      sudo,
    } = currentUser || {};

    return sudo === true;

  }


  renderImage() {

    const {
      image,
    } = this.getObjectWithMutations();


    const {
      classes,
    } = this.props;

    return image ? <Image
      className={classes.image}
      src={image}
      type="middle"
    /> : <Paper
      className={classes.noImage}
    >
        <Typography
          variant="display2"
          noWrap={false}
          className="text"
        >
          No Image
      </Typography>
      </Paper>

  }


  renderEditableView() {

    const {
      classes,
    } = this.props;

    const {
      image,
    } = this.getObjectWithMutations();

    return <Grid
      container
      spacing={8}
    >

      <Grid
        item
        xs={12}
      >
        {this.getTextField({
          name: "name",
          label: this.lexicon("Name"),
          helperText: this.lexicon("Product name"),
        })}

      </Grid>

      <Grid
        item
        xs={12}
      >

        <Uploader
          className={[classes.uploader, "fullWidth"].join(" ")}
          onUpload={result => {
            console.log("On upload", result);

            const {
              path,
            } = result.data && result.data.singleUpload || {};

            if (path) {
              this.updateObject({
                image: path,
              });
            }

          }}
        >
          {this.renderImage()}
        </Uploader>

      </Grid>


    </Grid>;

  }



  renderDefaultView() {

    const {
      name,
    } = this.getObjectWithMutations() || {};

    return <Grid
      container
      spacing={8}
    >

      <Grid
        item
        xs={12}
      // style={{
      //   border: "1px solid red",
      //   flex: 1,
      // }}
      >

        {this.renderImage()}

      </Grid>

      {/* <Grid
        item
      >

        <Typography
          variant="display2"
        >
          Name: {name}
        </Typography>

      </Grid> */}

    </Grid>;

  }

  render() {

    const {
      classes,
    } = this.props;

    return <Paper
      className={classes.root}

      style={{
        height: "100%",
      }}
    >
      {super.render()}
    </Paper>
  }


}


export default withStyles(styles)(Product);