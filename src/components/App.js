import React ,{useState,useEffect} from 'react'
import Web3 from "web3"
import StormNGNToken from "../abis/StormNGNToken.json"
import StormSwap from "../abis/StormSwap.json"
import ERC20 from "../abis/ERC20.json"

import Main from "./Main"
import Loading from "./Loading"
import Navbar from "./Navbar"
import Intialoverlay from "./Intialoverlay"

import chainlink from "../chainlink.png"
import "./App.css"
//import Feedbar from "./Feedbar"

function App(props){

	//States
	const [loading, setLoading] = useState(true)
	const [loadingIntialPrice, setLoadingIntialPrice] = useState(true) //set to true later
	const[prices, setPrices] = useState({})
	const [account, setAccount] = useState("0x0000000000000000000000000000000000000000")
	const [currentTokenAddress, setCurrentTokenAddress] = useState("0x01be23585060835e02b77ef475b0cc51aa1e0709")
	const [currentName, setCurrentName] = useState("Link")
	const [currentAmount, setCurrentAmount] = useState(0)
	const [currentTokenPrice,setCurrentTokenPrice] = useState(0)
	//const [erc20Token, setErc20Token] = useState()
	const [stormNGN, setStormNGN] = useState({})
	const [stormSwapApp, setStormSwapApp] = useState({})
	const [showButton, setShowButton] = useState(false)
	const [numberOfTokens, setNumberOfTokens] = useState("1")
	const [listOfTokens, setListofTokens] = useState([])
	const [tokenPrices,setTokenPrice] = useState([])
	const [lastOrderID,setLastOrderID] = useState("")
	

	// to be done before anything loads
	useEffect(()=>{
		( async () =>{

			await loadWeb3()
			await loadBlockchainData()

		})()
	},[])

	let buyToken = async (orderID) => {
		setLoading(true)
		const web3 = window.web3
		let Amount = String(currentAmount)
		Amount = web3.utils.toWei(Amount,"ether")
		let sender = account
		let token = currentTokenAddress
		let order_id = orderID
		try{
			
			await stormSwapApp.methods.buyToken(Amount,token,order_id).send({from: sender})
		}catch(err){
			console.log(err)
		}
		console.log({order_id,Amount,sender,token})
		setLoading(false)

	}

	let handleInputChange = (event) =>{
		setCurrentAmount(event.target.value)
	}

	let changeToken = async(value) =>{

		setCurrentTokenAddress(value)
		let selectToken = tokenPrices.filter((item) => item.token === value)[0]
		setCurrentName(selectToken.name)
		let priceFloat = parseFloat(selectToken.price)
		setCurrentTokenPrice(priceFloat)

	}

	let loadPrices = async() => {
		setLoadingIntialPrice(false)
		setLoading(true)
		try{
		const web3 = window.web3
		const networkId = await web3.eth.net.getId()

		//set all tokens the prices
		      	let arrayofTokens = [];
		    	let numberAllowedToken = await stormSwapApp.methods.countAllowedTokens().call()
		    	let cnt = parseInt(numberAllowedToken) + 1
				setNumberOfTokens(numberAllowedToken)


				const o_arr = [ ...listOfTokens]
		    	const o_obj = [ ...tokenPrices]
		    	
		    	for (var i = 1; i < cnt; i++) {
		    		let price = 0
		    		let name = ""
		    		switch(i){
		    			case 1:
		    				name = "StormNGN"
		    			break; 
		    			case 2:
		    				name="Link"
		    			break;
		    			case 3: 
		    				name ="Dai"
		    			default:
		    		}
		    		let token = await stormSwapApp.methods.allowedTokensIndexForLooop(i).call()
		    		
		    		o_arr.push(token)
		    		

		    		console.log(token)

		    		if(token === StormNGNToken.networks[networkId].address){
		    			console.log(account)
		    			await stormSwapApp.methods.requestNGNRate().send({from: account})
		    			await new Promise(resolve => setTimeout(resolve,6000))
		    			price = await stormSwapApp.methods.currentNGN_rate().call()
		    		}else{
		    			price = await stormSwapApp.methods.getTokenUSDPrice(token).call()
		    		}

		    		if(currentName === name ){
		    			setCurrentTokenPrice(parseFloat(web3.utils.fromWei(price,'ether')))
		    		}

		    		o_obj.push({
		    			name: name,
		    			token: token,
		    			price: web3.utils.fromWei(price,'ether')
		    		})
		    		console.log({
		    			name: name,
		    			token: token,
		    			price: web3.utils.fromWei(price,'ether')
		    		})
		    		
		    	}
		    	setTokenPrice(o_obj)
		    	setListofTokens(o_arr)
		}catch(err){
			console.log(err)
		}
		setLoading(false)

	}

	// loading web3
	let loadWeb3 = async () =>{
		if (window.ethereum) {
      		window.web3 = new Web3(window.ethereum)
      		await window.ethereum.enable()
    	} else if (window.web3) {
      		window.web3 = new Web3(window.web3.currentProvider)
	    } else {
		    window.alert(
		       "Non-Ethereum browser detected. You should consider trying MetaMask!"
		    )
	    }
	}

	//loading all contract data

	let loadBlockchainData = async() =>{
		try{
		const web3 = window.web3
		const accounts = await web3.eth.getAccounts()
		setAccount(accounts[0])

		const erc20 = new web3.eth.Contract(ERC20.abi,currentTokenAddress)

		// let erc20Balance = await erc20.methods.balanceOf(account).call()
		
		// setCurrentBalance(erc20Balance.toString())

		//Getting the network ID
		const networkId = await web3.eth.net.getId()

		//loading SwarmToken
		const stormNGNTokenData = StormNGNToken.networks[networkId]
	    if (stormNGNTokenData) {
	      const stormNGNToken = new web3.eth.Contract(
	        StormNGNToken.abi,
	        stormNGNTokenData.address
	      )
	      setStormNGN({
	      	...stormNGNToken
	      })
	       setCurrentTokenAddress(stormNGNTokenData.address)
	       setCurrentName("StormNGN")
	      
	      



	    } else {
	      window.alert("StormNGN contract not deployed to detected network.")
	    }


	    //loading SwarmSwap
	    const stormSwapData = StormSwap.networks[networkId]
	    if (stormSwapData) {
	      const stormSwap = new web3.eth.Contract(
	        StormSwap.abi,
	        stormSwapData.address
	      )
	      setStormSwapApp({...stormSwap})
	      	
	    } else {
	      window.alert("StormSwap contract not deployed to detected network.")
	    }
		}catch(err){
			console.log(err)
		}

	    setLoading(false)

	}

	 
	return(

		<div>
		<Navbar account={account} />
		{
			loading ? 
			<Loading/> : <div> {
				loadingIntialPrice ? <Intialoverlay startPrice={() => loadPrices()}/>
				:<Main
				account={account}
				currentAmount= {currentAmount}
				showButton = {showButton}
				prices={tokenPrices}
				setShowButton = { (value) => setShowButton(value)}
				changeToken = {(value) => changeToken(value)}
				currentName={currentName}
				onChangeAmount={handleInputChange}
				currentTokenPrice={currentTokenPrice}
				buyToken={buyToken}
				/>
			}</div>
		}
		</div>

	) 
		
	
}

export default App