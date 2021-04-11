import React, { useState} from 'react';
import PayPalbutton from './PayPalbutton.js';
import Feedbar from './Feedbar.js'

const dropdownStyle = {
	position: "absolute", 
	transform: "translate3d(0px, 38px, 0px)", 
	top: "0px", 
	right: "0px", 
	willChange: "transform",
	left: "100px",
    display: "block"
}
function Main(props){

	const [showDropDown , setShowDropDown] = useState(false)

	let drop_item = props.prices.map((value) => <button key={value.token} onClick={()=>props.changeToken(value.token)} className="dropdown-item">{value.name}</button> )

let get_calculate = (value) =>{
	if(value == "StormNGN"){
		return props.currentAmount * props.currentTokenPrice
	}else{
		return props.currentAmount / props.currentTokenPrice  
	}
}

return (


	<div className="main_body w-100 mb-3">
		<div className = "container mt-6 w-100">

			<div className="row justify-content-center">
				<div className="col-10 col-sm-7 align-self-center">
					<Feedbar prices = {props.prices} />

					<div className="px-3 my-3 shadow rounded">
						<div className="py-4">
							<div className="input-group mb-3">
								<div className="input-group-prepend">
								    <span className="input-group-text" id="basic-addon1">$</span>
								</div>
								<input
				                  type="text"
				                  className="form-control form-control-lg"
				                  placeholder="Your Amount"
				                  onChange={props.onChangeAmount}
				                  aria-label="Amount" aria-describedby="basic-addon1"
				                  required
				                />
				                <div className="input-group-append">
							    	<button className="btn btn-outline-secondary dropdown-toggle" onClick={()=>setShowDropDown(!showDropDown)} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							    		{props.currentName}
							    	</button>

							    	{!showDropDown ? ' ':<div className="dropdown-menu" style={dropdownStyle}>
								      {drop_item}
								    </div>}
							  </div>	
			                </div>
		                	<div className="py-3 font-weight-bold text-right"> You get {get_calculate(props.currentName)} amount of {props.currentName} </div>
			                { !props.showButton ?
			                <div className="py-3">
			                	<button type="button" onClick={()=>props.setShowButton(true)} className="btn btn-success btn-lg btn-block">BUY</button>
			                </div>:
			                <div>
			                	<PayPalbutton buyToken={props.buyToken} amount={props.currentAmount}/>
			                	<div className="py-3">
			                		<button type="button" onClick={()=>props.setShowButton(false)} className="btn btn-secondary btn-lg btn-block">CANCEL</button>
			                	</div>
			                </div>	
			            	}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

)

}

export default Main