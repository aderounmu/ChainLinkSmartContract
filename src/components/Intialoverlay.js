import React, { useState} from 'react';
function Intialoverlay(props){

return (

	<div className="storm_overlay">
		<div className="storm_overlay-content">
			<div className="row justify-content-center">
				<div className="col-10 col-sm-7 align-self-center">
					<div className="mb-3">You need to pay a small token to use the NGNToken Price feed
					Please Kindly CLick the button to load the price</div>
					<button className="btn btn-primary btn-lg btn-block" onClick={()=>props.startPrice()}>Load NGNToken feed</button>
				</div>
			</div>
		</div>
	</div>
)

}

export default Intialoverlay