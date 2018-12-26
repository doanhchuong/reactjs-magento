import React, { Component } from 'react';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword : this.props.keyword
        }
    }
    
    updateKeyword = (event) => {
        const {textSearchProps} = this.props;
        this.setState({
            keyword : {...this.state,keyword : event.target.value}
        });
        textSearchProps(event.target.value)
       
    }
    showTotalSearch = () => {
        const {totalSearch} = this.props;
        if(this.state.keyword && totalSearch) {
            return <h5 className = "row justify-content-left" >Found {totalSearch} product in list</h5>
        }
    }
    
    render() {
        const {textSearchProps} = this.props;
        const {keywordStt} = this.state;
        return (
            <div className="row justify-content-left">
                <div className="col-sm-5">
                    <div className="card card-sm">
                    <div className="card-body row no-gutters align-items-center">
                        <div className="col-auto">
                        <i className="fas fa-search h4 text-body" />
                        </div>
                        {/*end of col*/}
                        <div className="col">
                        <input className="form-control form-control-lg form-control-borderless" type="search" value={keywordStt} onChange= {(event) => this.updateKeyword(event) } placeholder="Search by name" />
                        </div>
                        {/*end of col*/}
                        <div className="col-auto">
                        <button className="btn btn-lg btn-success" onClick = { () => textSearchProps(keywordStt) }>Search</button>
                        </div>
                        {/*end of col*/}
                    </div>
                    </div>
                </div>
                <div className="col-sm-5">
                    {this.showTotalSearch()}
                </div>
                    {/*end of col*/}
            </div>
        );
    }
}

export default Search;