import React, { useState} from 'react';

function Feedbar(props){

const items = props.prices.map((value)=><div key={value.token} className="col-3 px-2"><div>{value.name}</div> || <div>{value.price}</div></div>)

return (


	<div>
		<div className="px-3 my-3 shadow-sm rounded">
			<div className="text-center h4 my-4"> Price Feed</div>
			<div className="row">
				
				{items}
			</div>
		</div>
	</div>

)

}

export default Feedbar