import React, { useState} from 'react';
import ReactDOM from "react-dom"



function PayPalbutton(props){
	let sendID = (item) =>{
		console.log(item)
    	props.buyToken(item)

	}
	const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
  const createOrder = (data, actions) =>{
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: props.amount,
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details)=>{
    	
    	sendID(details.id)
    });
  };

  return (
    <PayPalButton
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
  );
}

export default PayPalbutton