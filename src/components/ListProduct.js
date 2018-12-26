import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ListProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addClass: false,
            currentPage : this.props.currentPage,
            fakecurrentPage : this.props.currentPage
        }
    }
    
    Product = (ProductItem) => {
        let status = (ProductItem.status) ? "Enable" : "Disable";
        let divImage = '';
        if(ProductItem.custom_attributes.length){
            let urlImage = ProductItem.custom_attributes.filter(function(item){
                return item.attribute_code === 'image';
               });
            if(urlImage.length) {
                let urlImageFull = this.props.baseUrlMedia +  urlImage[0].value;
                divImage = <img width="50px" height="50px" src ={urlImageFull} />
            }else{
                divImage = "No image";
            }
        }
        return (
            <tr key={ProductItem.id}>
                <th scope="row">{ProductItem.id}</th>
                <td>{ProductItem.name}</td>
                <td>{ProductItem.sku}</td>
                <td>{ProductItem.price}</td>
                <td>{ProductItem.type_id}</td>
                <td>{divImage}</td>
                <td>{status}</td>
                <td>
                <div className="btn group">
                    <button type="button" className="btn btn-success" onClick = {() => { this.props.isshowEdit(ProductItem) }}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick = {() => {this.props.deleteProduct(ProductItem.sku)}}>Delete</button>
                </div>
                </td>
            </tr>
        )
    }
    handleClick = (number,event) => {
        this.props.updateDatawhenClickPage(number);
        this.setState({
            addClass : !this.state.addClass
        });
        
    }
    showClass = (number) => {
        if(number == 1 ) {
            return "page-item active";
        }else{
            return "page-item";
        }
    }
    Pagination = () => {
        if(this.props.total){
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(this.props.total / 20); i++) {
                pageNumbers.push(i);
            }
            const renderPageNumbers = pageNumbers.map(number => {
                return (
                    <li className={this.showClass(number)}
                        key={number}
                        id={number}
                        onClick={ (event) => this.handleClick(number,event)}
                    >
                        <a className="page-link">{number}</a>
                    </li>
                );
              });
            return (
                <div className="container">
                        <ul className="pagination">
                            {renderPageNumbers}
                        </ul>
                </div>
            )
        }
        
    }
    handleClickToolBarPre = (e,currentPage) => {
        if(this.state.currentPage > 1 && this.props.statusClick){
            let newCurrent = parseInt(currentPage) - 1
            // e.currentTarget.value = newCurrent;
            this.props.updateDatawhenClickPage(newCurrent);
            this.setState({
                currentPage : newCurrent,
                fakecurrentPage : newCurrent
            });
            this.props.setStatusClick();
            this.props.setIsLoading();
        }
        
    }
    handleClickToolBarNext = (e,currentPage,count) => {
        if(currentPage < count && this.props.statusClick) {
        let newCurrent = parseInt(currentPage) + 1
        console.log(newCurrent);
        // e.currentTarget.value = newCurrent;
        this.props.updateDatawhenClickPage(newCurrent);
        this.setState({
            currentPage : newCurrent,
            fakecurrentPage : newCurrent
        });
        this.props.setStatusClick();
        this.props.setIsLoading();
        }
        
    }
    HandleKeyPress = (e,count) => {
        if(e.key == 'Enter'){
            let value = e.target.value;
            if(value) {
                if(isNaN(value)){
                    alert('Input invalid.Please only number')
                }else{
                    if(value !== this.state.currentPage){
                        if(value > 0 && value <= count){
                            this.props.updateDatawhenClickPage(value);
                            this.setState({
                                currentPage : value,
                                fakecurrentPage : value
                            });
                            this.props.setStatusClick();
                            this.props.setIsLoading();
                        }else{
                            alert('Number page invalid')
                        }
                    }
                }
            }else{
                alert('Please type number you want go to')
            }
        }        
    }
    handleOnChange = (e) => {
        this.setState({
            fakecurrentPage : e.target.value
        });
    }

    Toolbar = (count) => {
        var style = {
            fontSize: '20px',
            fontWeight: 'bold'
        };
        if(count) {
            return ( 
                <div className="toolbar">
            <div className = "total">
                <span className="text-left" style={style}>Total : {this.props.total}</span>
            </div>
                <div className="container custom__pagination">
                    <ul className="pagination">
                        <li className={ (this.state.currentPage === 1 ) ? "page-item disabled" : "page-item" } onClick = {(e) => this.handleClickToolBarPre(e,this.props.currentPage)}><a className="page-link">Previous</a></li>
                        <li className="input__page">
                            <input type="text" className = "form-control" name="current_page" id="fpage"  value ={this.state.fakecurrentPage} onChange={(e) => this.handleOnChange(e)} onKeyPress={(e) => this.HandleKeyPress(e,count)} />
                        </li>
                        <li className="count__page"><span>of {count}</span></li>
                        <li className={ (parseInt(this.state.currentPage) === count ) ? "page-item disabled" : "page-item" } onClick = {(e) => this.handleClickToolBarNext(e,this.props.currentPage,count)}><a className="page-link">Next</a></li>
                    </ul>
                </div>
            </div>
            )
        }
    }
    ListProduct = () => {
        let messNoRecord = "For now we don't have record";
        let messLoading = "Loading Data" ;
        let dataProduct = this.props.dataProduct;
        let loading = this.props.loading;
        if (loading) {
            return (
                <tr>
                    <th>{messLoading}</th>
                </tr>
                )
        }else{
            if(dataProduct.length){
                return dataProduct.map((ProductItem, key) => {     
                     return (this.Product(ProductItem)) 
                 })
             }else{
                 return (
                 <tr>
                     <th>{messNoRecord}</th>
                 </tr>
                 )
             }
        }
        
    }
    showMessageDelete = () => {
        if(this.props.isDeleteSucess){
            return (
                <div className="alert alert-success">
                        <strong>Delete Success!</strong> Data in instance magento 2 deleted.
                </div>
            )
        }
        if(this.props.isAddSucess){
            return (
                <div className="alert alert-success">
                        <strong>Add Product Success!</strong> Data in instance magento 2 updated.
                </div>
            )
        }
        if(this.props.isEditSucess){
            return (
                <div className="alert alert-success">
                        <strong>Edit Product Success!</strong> Data in instance magento 2 updated.
                </div>
            )
        }
        
    }
    render() {
       
        let countPages = Math.ceil(this.props.total / 20);
        return (
            <div className="col-sm-9 col-sm-9">
                {this.Toolbar(countPages)}
                {this.showMessageDelete()}
                <table className="table table-striped __table">
                    <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Sku</th>
                        <th scope="col">Price</th>
                        <th scope="col">Type</th>
                        <th scope="col">Image</th>
                        <th scope="col">Status</th>
                        <th scope="col">Modify</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.ListProduct()}
                    </tbody>
                </table>
                {this.Pagination()}
            </div>
        );
    }
}
ListProduct.propTypes = {
    isshowEdit: PropTypes.func,
    isEditSucess: PropTypes.bool
    };
export default ListProduct;