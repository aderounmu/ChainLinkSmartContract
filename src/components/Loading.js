import React, { useState} from 'react';
import chainlink from "../chainlink.png"

function Loading(props){



return (

	<div className="storm_overlay">
		<div className="storm_overlay-content">
			<div className="row justify-content-center">
				<div className="col-10 col-sm-7 align-self-center">
					<img src={chainlink} width="50px" height="50px"/>
			      	<div> Wait a minute while we get this done ...</div>

				</div>
			</div>
		</div>
	</div>

)

}

export default Loading