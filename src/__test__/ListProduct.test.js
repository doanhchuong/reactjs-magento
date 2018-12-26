import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import ListProduct from '../components/ListProduct';

describe('ListProduct', () => { 
    const props = {
      dataProduct: [
      { id: 1, name: 'test', sku: '1321dsa', price: 20 , type_id: 'simple' },
      {  id: 2, name: 'test1', sku: '21dsa', price: 20 , type_id: 'simple'  },
      ],
      loading : true,
      baseUrlMedia : "",
      total:2
      };
  
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<ListProduct {...props} />, div);
      ReactDOM.unmountComponentAtNode(div);
      });
      test('has a valid snapshot', () => {
        const component = renderer.create(
          <ListProduct {...props} />
          );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        });
  });