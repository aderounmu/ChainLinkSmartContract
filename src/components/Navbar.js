import React, { useState} from 'react';

function Navbar(props){



return (

<nav className="navbar fixed-top navbar-light bg-light justify-content-between">
  <a className="navbar-brand">
  <img src="" width="30" height="30" className="d-inline-block align-top" alt=""/>
  	Storm Exchange 
  </a>
  <div>
   	<div>{props.account}</div>
  </div>
</nav>
	

)

}

export default Navbar