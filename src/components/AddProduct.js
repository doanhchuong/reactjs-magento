import React, { Component } from 'react';
import  FormErrors from './FormErrors';
class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowAdd : false,
            name : '',
            sku : '',
            price : '',
            type: 'simple',
            status : '1',
            formErrors: {name: '', sku: '', price: ''},
            nameValid: false,
            skuValid: false,
            priceValid: false,
            formValid: false
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.productEdit){
            return {
                name: nextProps.productEdit.name,
                sku : nextProps.productEdit.sku,
                price : nextProps.productEdit.price ,
                type : nextProps.productEdit.type_id , 
                status : nextProps.productEdit.status,
                nameValid: true,
                skuValid: true,
                priceValid : true,
                formValid : true
            };
        }else { 
            return null
         }
    }
    changeStateAddButton = () => {
        this.setState({
            isShowAdd : !this.state.isShowAdd
        });
        
    }
    showButtonAdd = () => {
        if(this.props.isshowEdit){
            return <button type="button" className="btn btn-primary">Edit Product</button>
        }else{
            if(this.state.isShowAdd) {
                return (
                    <button type="button" className="btn btn-secondary" onClick = {() => this.changeStateAddButton()} >Close</button>
                )
            }else{
                return (
                    <button type="button" className="btn btn-primary" onClick = {() => this.changeStateAddButton()} >Add New Product</button>
                )
            }
        }
    }
    handleUserInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
        this.validateField(name, value);
    }
    validateField = (name, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let nameValid = this.state.nameValid;
        let skuValid = this.state.skuValid;
        let priceValid = this.state.priceValid;
        switch(name) {
            case 'name':
            nameValid = value.length >= 3;
            fieldValidationErrors.name = nameValid ? '': ' must >= 3 character';
            break;

            case 'sku':
            skuValid = value.length >= 3;
              fieldValidationErrors.sku = skuValid ? '' : ' must >= 3 character';
              break;
            
            case 'price':
            priceValid = ( !isNaN(value) && parseInt(value) > 0 );
              fieldValidationErrors.price = priceValid ? '' : ' must a number and > 0';
              break;
           
            default:
              break;
          }
        
          this.setState({
            formErrors: fieldValidationErrors,
            nameValid: nameValid,
            skuValid: skuValid,
            priceValid : priceValid
          });
          this.updateFormValid(nameValid, skuValid, priceValid);
    } 
    updateFormValid = (nameValid, skuValid, priceValid) =>{
        let formValidUpdate = (nameValid && skuValid && priceValid ) ? true : false;
        this.setState({
            formValid : formValidUpdate
        });
        
    }
    addProduct = (event) => {
        this.props.addProductM2(this.state);
        this.setState({
            name : '',
            sku : '',
            price : '',
            type: 'simple',
            status : '1',
        });
        
    }
    updateProduct = (event) => {
        this.props.updateProductM2(this.state,this.props.productEdit.sku);
        
    }
    updateShowAdd = () => {
        this.props.isshowAddfc();
        this.setState({
            isShowAdd : (this.state.isShowAdd) ? false : this.state.isShowAdd,
            name : '',
            sku : '',
            price : '',
            type: 'simple',
            status : '1',
        });
        
    }
    showAddorSaveBtn =  () => {
        if(!this.props.isshowEdit){
            return <button className="btn btn-primary" disabled={!this.state.formValid} onClick ={(event) => this.addProduct(event)} >Add</button>
        }else{
            return (
                <div>
                    <button className="btn btn-secondary" onClick ={() => this.updateShowAdd()} >Back</button>
                    <button className="btn btn-primary" disabled={!this.state.formValid} onClick ={(event) => this.updateProduct(event)} >Save</button>
                </div>
            )
        }
    }
    isShowType = () => {
        if(!this.props.isshowEdit) {
            return (
                <div className="form-group">
                <label>Type</label>
                <select className="form-control" id="fType" name="type" value={this.state.type}  onChange={(event) => this.handleUserInput(event)}>
                    <option value ="simple">Simple Product</option>
                    <option value = "configurable">Configable Product</option>
                    <option value ="grouped">Group Product</option>
                    <option value = "downloadable">Download Product</option>
                </select>
            </div>
            )
        }
    }
    ShowContentAddUser = () => {
        if(this.state.isShowAdd || this.props.isshowEdit){
            return (
                <div className="card-body">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" name="name" id="fName" value={this.state.name}  onChange={(event) => this.handleUserInput(event)}
 placeholder="Enter Name" />
                    </div>
                    <div className="form-group">
                        <label>Sku</label>
                        <input type="text" className="form-control" name="sku" id="fSku" value={this.state.sku} onChange={(event) => this.handleUserInput(event)}
  placeholder="Enter Sku" />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input type="text" className="form-control" name="price" id="fPrice" value={this.state.price}  onChange={(event) => this.handleUserInput(event)}
  placeholder="Enter Price" />
                    </div>
                    { this.isShowType()  }
                    <div className="form-group">
                        <label>Status</label>
                        <select className="form-control" id="fStatus" name="status" value={this.state.status}  onChange={(event) => this.handleUserInput(event)}>
                            <option value ="1">Enable</option>
                            <option value = "0">Disable</option>
                        </select>
                    </div>
                    <div className="panel panel-default">
                        <FormErrors formErrors={this.state.formErrors} />
                    </div>
                    {this.showAddorSaveBtn()}
                </div>
            )
        }
    }
    
    render() {
        return (
            <div className="col-sm-3">
                <div className="card text-center">
                {this.showButtonAdd()}              
                {this.ShowContentAddUser()}
                </div>
          </div>
          
        );
    }
}

export default AddProduct;