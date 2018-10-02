
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';


// import FileInput from '../FileInput';

import {SingleUploader} from '../SingleUploader';


let defaultProps = {...SingleUploader.defaultProps}

Object.assign(defaultProps, {
  multiple: true,
});

export class MultipleUploader extends SingleUploader{


  static defaultProps = defaultProps;


  upload(target){

    const {
      mutate,
    } = this.props;

    return target.validity.valid && mutate({
      variables: { files: target.files },
    })

  }

}


export default graphql(gql`
  mutation($files: [Upload!]!) {
    multipleUpload(files: $files) {
      id
      filename
      encoding
      mimetype
      path
    }
  }
`)(MultipleUploader)