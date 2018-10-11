import React, { Component } from 'react';
import PropTypes from 'prop-types';


import EditableView from 'apollo-cms/lib/DataView/Object/Editable';
import { Paper } from 'material-ui';
import { withStyles } from 'material-ui';
import Grid from '@prisma-cms/front/lib/modules/ui/Grid';

// import Span from '@prisma-cms/ui';

import SingleUploader from '@prisma-cms/front/lib/modules/react-cms-uploads/src/components/uploader/SingleUploader';
import Typography from 'material-ui/Typography';


export const styles = {
  root: {
    padding: 15,
  },
}

class Product extends EditableView {


  static propTypes = {
    ...EditableView.propTypes,
    classes: PropTypes.object.isRequired
  }


  canEdit() {

    const currentUser = this.getCurrentUser();


    const {
      sudo,
    } = currentUser || {};

    return sudo === true;

  }



  renderEditableView() {

    return <Grid
      container
      spacing={8}
    >

      <Grid
        item
      >
        {this.getTextField({
          name: "image",
          Editor: SingleUploader,
        })}

      </Grid>

      <Grid
        item
      >
        {this.getTextField({
          name: "name",
          label: "Name",
          helperText: "Product name",
        })}

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
      >

      </Grid>

      <Grid
        item
      >

        <Typography
          variant="display2"
        >
          Name: {name}
        </Typography>

      </Grid>

    </Grid>;

  }

  render() {

    const {
      classes,
    } = this.props;

    return <Paper
      className={classes.root}
    >
      {super.render()}
    </Paper>
  }


}


export default withStyles(styles)(Product);