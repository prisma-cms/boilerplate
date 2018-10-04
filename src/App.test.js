import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import PrismaCms from "@prisma-cms/front";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PrismaCms
    App={App}
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});
