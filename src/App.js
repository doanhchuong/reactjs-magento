import React, { Component } from 'react';
import './App.css';
import { Header,Search,ListProduct,AddProduct,config} from './components';
import axios from 'axios';

const BASEURL = config.baseUrl;
const BASEURL_MEDIA = config.baseUrlMedia;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProduct : [],
      token : '',
      total : 0,
      totalSearch : 0,
      loading : true,
      dataOrigin : [],
      currentPage: 1,
      statusClick :false,
      isDeleteSucess : false,
      isAddSucess : false,
      isEditSucess : false,
      isshowEdit : false,
      keyword : '',
      productEdit : null,
      productDeleted : []
    };

  }
  componentDidMount() {
    this.getTokenAdminM2();
  }
  
  getTokenAdminM2 = () => {
    const PATH = 'rest/V1/integration/admin/token';
    let url =  `${BASEURL}${PATH}`;
    let data = JSON.stringify({
      username: config.username,
      password: config.password
    })
    axios.post(url, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // "Access-Control-Allow-Credentials" : "true",
          // "Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Headers": "*",
          // "Access-Control-Allow-Origin" : '10.0.0.202'
        },
        proxy: {
          host: '10.0.0.202',
          port: 80,
          changeOrigin: true,
          secure: false
        },
        crossDomain: true,
        // withCredentials: true,
        // credentials: 'same-origin'
    }
    ).then(res => {
      // res.header('Access-Control-Allow-Origin', '*');
      // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      if(res.statusText === 'OK'){
        this.setState({
          token : res.data
        });
        this.getListProduct(res.data,this.state.currentPage);
      }
    })
    .catch(error => {
      console.log(error);
    });

   
  }

  getListProduct = (token,number) => {
    if(token) { 
      const PATH = 'rest/V1/products/';
      const PARAM_SEARCH = '?searchCriteria[pageSize]=20&searchCriteria[currentPage]='+ number +'&?fields=';
      let url = `${BASEURL}${PATH}${PARAM_SEARCH}`;
      axios.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + token ,
        }
      }
    ).then(res => {
        if(res.statusText === 'OK'){
          this.setState({
            dataProduct : res.data.items,
            dataOrigin : res.data.items,
            total : res.data.total_count,
            loading : false
          });
          this.setStatusClick();
        }
    })
    .catch(error => {
      console.log(error);
    });
    }
  }
  deleteProduct = (sku) => {
    let token = this.state.token;
    const PATH = '/rest/V1/products/' + sku;
    let url = `${BASEURL}${PATH}`; 
    axios.delete(url, {
        headers: {
          'Authorization' : 'Bearer ' + token ,
        }
      }
    ).then(res => {
      if(res.statusText === 'OK' && res.data){
        this.updateDatawhenDelete(sku);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
  addProductM2 = (params) => {
    let token = this.state.token;
    let name = params.name;
    let sku = params.sku;
    let price = params.price;
    let status = params.status;
    let type = params.type;
    let data = JSON.stringify({
      product: {
        sku : sku,
        name : name,
        attribute_set_id : 4, 
        price : price,
        status : status,
        type_id : type
      }
    });
    const PATH = '/rest/V1/products';
    let url = `${BASEURL}${PATH}`;
    axios.post(url, data, {
      headers: {
        'Authorization' : 'Bearer ' + token ,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "*",
      },
      crossDomain: true,
  }
  ).then(res => {
    if(res.statusText === 'OK' && res.data){
        var dataOrigin = this.state.dataProduct;
        dataOrigin.push(res.data);
        var updatedData = dataOrigin;
        this.setState({
          dataProduct : updatedData,
          isAddSucess : !this.state.isAddSucess,
          total : parseInt(this.state.total) + 1 
        });
        setTimeout(() => {
          this.setState({
            isAddSucess : !this.state.isAddSucess
          });
        }, 2000);
    }
  })
  .catch(error => {
    console.log(error);
  });
    
  }
  updateProductM2 = (params , sku) => {
    let token = this.state.token;
    let name = params.name;
    let skuNew = params.skuNew;
    let price = params.price;
    let status = params.status;
    let data = JSON.stringify({
      product: {
        sku : skuNew,
        name : name,
        attribute_set_id : 4, 
        price : price,
        status : status
      }
    });
    const PATH = '/rest/V1/products/' + sku;
    let url = `${BASEURL}${PATH}`
    axios.put(url, data, {
      headers: {
        'Authorization' : 'Bearer ' + token ,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "*",
      },
      crossDomain: true,
  }
  ).then(res => {
    if(res.statusText === 'OK' && res.data){
        var dataOrigin = this.state.dataProduct;
        let objIndex = dataOrigin.findIndex((obj => obj.sku === sku));
        dataOrigin[objIndex].name = res.data.name;
        dataOrigin[objIndex].sku = res.data.sku;
        dataOrigin[objIndex].price = res.data.price;
        dataOrigin[objIndex].status = res.data.status;
        var updatedData = dataOrigin;
        this.setState({
          dataProduct : updatedData,
          isEditSucess : !this.state.isEditSucess
        });
        setTimeout(() => {
          this.setState({
            isEditSucess : !this.state.isEditSucess
          });
        }, 2000);
    }
  })
  .catch(error => {
    console.log(error);
  });
  }
  updateDatawhenClickPage = (number) => {
    this.setState({
      currentPage : number
    });
    this.getListProduct(this.state.token,number);
  }
  
  textSearchProps = (text) => {
    this.setState({
      keyword : text
    });
    this.updateDatawhenSearch(text);
  }
  updateDatawhenDelete = (sku) => {
    var dataOrigin = this.state.dataOrigin;
    this.state.productDeleted.push(sku);
    let productDeleted = this.state.productDeleted;
    var updatedData = dataOrigin.filter(function(item){
       return !productDeleted.includes(item.sku) 
      });
    this.setState({
      dataProduct : updatedData,
      productDeleted : productDeleted,
      totalSearch : updatedData.length,
      isDeleteSucess : !this.state.isDeleteSucess,
      total : parseInt(this.state.total) - 1 
    });
    setTimeout(() => {
      this.setState({
        isDeleteSucess : !this.state.isDeleteSucess
      });
    }, 2000);
  }
  updateDatawhenSearch = (text) => {
    let dataOrigin = this.state.dataOrigin;
    let productDeleted = this.state.productDeleted;
    let updatedData = dataOrigin.filter(function(item){
       return item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1 
      });
    if(this.state.productDeleted) {
      updatedData = updatedData.filter(function(item){
        return !productDeleted.includes(item.sku) 
       });
    }
    
    this.setState({
      dataProduct : updatedData,
      totalSearch : updatedData.length
    });
  
  }

  setIsLoading = () => {
    this.setState({
      loading : !this.state.loading
    });
  }
  setStatusClick = () => {
    this.setState({
      statusClick : !this.state.statusClick
    });
  }
  isshowEdit = (ProductItem) => {
    this.setState({
        isshowEdit : true,
        productEdit : ProductItem
    });
  }
  isshowAdd = () =>{
    this.setState({
      isshowEdit : false,
      productEdit : null
    });
  }

  render() {    
    return (
      <div className="App">
        <Header />
        <div className="container">
          <Search keyword = {this.state.keyword} textSearchProps = { (text) => this.textSearchProps(text) } totalSearch = {this.state.totalSearch}/>
          <div className="row">
            <ListProduct isshowEdit = { (ProductItem) => this.isshowEdit(ProductItem) } isEditSucess = {this.state.isEditSucess} isAddSucess = {this.state.isAddSucess} isDeleteSucess = {this.state.isDeleteSucess} deleteProduct = {(sku) => this.deleteProduct(sku)} statusClick = {this.state.statusClick} setStatusClick = {() => this.setStatusClick() } setIsLoading = {() => this.setIsLoading()} updateDatawhenClickPage = {(number) => this.updateDatawhenClickPage(number)} currentPage = {this.state.currentPage} total = {this.state.total} baseUrlMedia = {BASEURL_MEDIA} loading = {this.state.loading} dataProduct = {this.state.dataProduct}/>
            <AddProduct isshowAddfc = { () => this.isshowAdd() } productEdit = {this.state.productEdit} isshowEdit ={this.state.isshowEdit} updateProductM2 = { (params,sku) => {this.updateProductM2(params,sku)}}  addProductM2 = {(params) => {this.addProductM2(params)}} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
