import React, { Component } from 'react';

class FormErrors extends Component {
    render() {
        let errors = this.props.formErrors;
        let divStyle = {
            color: 'red'
        }
        return (
            <div className='formErrors'>
                { Object.keys(errors).map((value, field) => {
                    if(errors[value]){
                        return (
                        <p key={field} style={divStyle}>{value} {errors[value]}</p>
                        )        
                    } else {
                        return '';
                        }
                    })
                }
            </div>
        );
    }
}

export default FormErrors;