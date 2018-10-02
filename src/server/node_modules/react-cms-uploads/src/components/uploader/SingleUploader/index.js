
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';


import FileInput from '../FileInput';

export class SingleUploader extends Component{

  static propTypes = {
    mutate: PropTypes.func.isRequired,
    FileInput: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
    onUpload: PropTypes.func,
  };


  static defaultProps = {
    FileInput,
    multiple: false,
  };


  async handleChange({ target }){

    const result = await this.upload(target);

    const {
      onUpload,
    } = this.props;

    if(onUpload){
      onUpload(result);
    }

    return result;

  }


  upload(target){

    const {
      mutate,
      onUpload,
    } = this.props;

    return target.validity.valid && mutate({
      variables: { file: target.files[0] },
    });
  }


  render(){

    const {
      mutate,
      multiple,
      onUpload,
      FileInput,
      ...other
    } = this.props;

    return <FileInput
      multiple={multiple}
      onChange={event => this.handleChange(event)} 
      {...other}
    />

  }

}


// const SingleUploader = ({ mutate }) => {

// }

export default graphql(gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      id
      filename
      encoding
      mimetype
      path
    }
  }
`)(SingleUploader);