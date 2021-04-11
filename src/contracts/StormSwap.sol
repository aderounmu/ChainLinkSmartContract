pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";



contract StormSwap is ChainlinkClient , Ownable{
    
    //owner

    address public swapOwner;

    //variables for api 
    /* variables for order id*/
    string public orderurl; 
    string public payouturl;
    string public NGNrateurl;
    address public oracle;
    bytes32 public tran_jobId;
    bytes32 public NGN_jobId;
    uint256 public fee;
    
    /*variables for price order id*/
    
    uint256 public currentNGN_rate;
    
    /* tracking variables */
    uint256 public point_level;
    
    string public name = "STORM USD FIAT TO CRYPTO EXCHANGE";
    IERC20 public swarmNGN; // the storm naira
    address public swarmNGN_add;
    struct Transaction {
        uint256 id;
        string Transaction_id;
        address Transaction_sender;
        address token;
        uint256 amount;
        bool confirmed;
        string message;
    }
    struct Token{
        address token_add;
        bool allowed;
        uint256 price;
    }
    
    
    /*event TransactionConfirmed(
        string Transaction_id,
        address Transaction_sender,
        address token,
        uint256 amount,
        string message
    );*/
    
    event Transactionfailed(
        string Transaction_id,
        address Transaction_sender,
        address token,
        uint256 amount,
        string message
    );
    
    mapping(string => Transaction) public allTransactions; // mapping of all completed allTransactions true is completed false is not 
    uint256 public countAllTransactions = 0;//a count of all allTransactions
    mapping(uint256 => string) public allTransactionID;
    
    bytes32 lastrequestID;
    bytes32  lastrequestNGNID;
    
    mapping(address => address) public tokenPriceFeedMapping;
    mapping(address => Token) public allowedTokens;// the  bool would always be true when created
    mapping(uint256 => address) public allowedTokensIndexForLooop;
    uint256 public countAllowedTokens = 0;
    uint256 public countTokenPriceFeedMapping = 0;
    
    constructor(
        address _swarmNGN, 
        string memory  _orderurl,
        string memory _rateurl,
        address _oracle,
        string memory _tran_jobId,
        string memory _NGN_jobId
        //uint256 _fee
    ) public{
        setPublicChainlinkToken();
        swarmNGN = IERC20(_swarmNGN);
        swarmNGN_add = _swarmNGN;
        orderurl = _orderurl; 
        NGNrateurl = _rateurl;
        oracle = _oracle;
        tran_jobId = stringToBytes32(_tran_jobId);
        NGN_jobId = stringToBytes32(_NGN_jobId);
        fee = 0.1 * 10 ** 18; // 0.1 LINK ;
        swapOwner = msg.sender;
        addAllowedTokens(_swarmNGN);
        
        //call the naira rate when deployed
        //lastrequestNGNID = requestNGNRate();
    }
    
    //update API PARAMETERS
    function updateAPI_para(
        string memory  _orderurl,
        string memory _rateurl,
        address _oracle,
        string memory _tran_jobId,
        string memory _NGN_jobId,
        uint256 _fee
    ) public onlyOwner{
        orderurl = _orderurl; 
        NGNrateurl = _rateurl;
        oracle = _oracle;
        tran_jobId = stringToBytes32(_tran_jobId);
        NGN_jobId = stringToBytes32(_NGN_jobId);
        fee = _fee; // 0.1 LINK ;
    }
    
    
    
    
    
    
    //function to addTokens
    function addAllowedTokens(address token) public onlyOwner {
        if(!allowedTokens[token].allowed){
            allowedTokens[token] = Token(token, true, 0);
            countAllowedTokens++;
            allowedTokensIndexForLooop[countAllowedTokens]=token;
        }
    }
    //function to add priceFeedAddress
    function setPriceFeedContract(address token, address priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[token] = priceFeed;
    }
    
    //function to send tokens
    function sendToken(string memory orderID, address _token, uint256 _amount) public {
        
        point_level=5;
        
        //require the amount to me more than zero 
        //require(_amount > 0, "amount cannot be 0");
        if(_amount > 0){
        //require the amount to be more than available balance of exchange
            //require(_amount < IERC20(_token).balanceOf(address(this)),"Amount is more than available");
            if(_amount < IERC20(_token).balanceOf(address(this))){
            //check token is available
                if(allowedTokens[_token].allowed){
                    point_level=6;
                    //check if Transaction as already been confirmed
                    
                    if(!allTransactions[orderID].confirmed){
                        point_level=7;
                        //if the Transaction has been confirmed
                        //send amount
                        if(IERC20(_token).transfer(allTransactions[orderID].Transaction_sender,_amount)){
                        //update balance;
                        //update Transaction
                        allTransactions[orderID].confirmed = true;
                        //emit TransactionConfirmed(orderID,allTransactions[orderID].Transaction_sender,_token,_amount,'The transaction was successful');
                        allTransactions[orderID].message = 'The transaction was successful';
                        }else{
                            allTransactions[orderID].message = 'The transaction was unsuccessful';
                        } 
                    }else{
                       //emit Transactionfailed(orderID,allTransactions[orderID].Transaction_sender,_token,_amount,'Sorry this transaction has been done already'); 
                       allTransactions[orderID].message = "Sorry this transaction has been done already";
                    }
                }else{
                    //emit Transactionfailed(orderID,allTransactions[orderID].Transaction_sender,_token,_amount,'sorry this token is not available');
                    allTransactions[orderID].message= "sorry this token is not available";
                }
            }else{
               allTransactions[orderID].message="Amount is more than available exchange balance"; 
            }
        }else{
            allTransactions[orderID].message="Amount Cannot be zero";
        }
    }
    
    //function to collect token 
    function collectToken() public{
    
        
    }
    
    
    
    
    //Buy Token FUNCTIONS
    function buyToken(uint256 _amount, address _token, string memory orderID) public{
        
        //create  transactions 
        if(!allTransactions[orderID].confirmed){
            countAllTransactions++;
            allTransactions[orderID] = Transaction(countAllTransactions, orderID, msg.sender,_token , _amount, false,'The transaction is being verify'); 
            allTransactionID[countAllTransactions] = orderID;
            point_level = 1;
            lastrequestID = requestStatus(orderID);
                
        }else{
               //emit Transactionfailed(orderID,msg.sender,_token,_amount,'Sorry this transaction has been done already'); 
               allTransactions[orderID].message ="Sorry this transaction has been done already";
        }
        
        
        //lastrequestNGNID = requestNGNRate();
        
        
    } 
    
    
    
    
    
    
    
    /**** THE FUNCTIONS TO ACCESS CHAINLINK API ***/
    
    
  
    function requestStatus(string memory _orderid) public returns (bytes32 requestId) 
    {
        Chainlink.Request memory req = buildChainlinkRequest(tran_jobId, address(this), this.fulfill.selector);
        
        //string memory baseurl = "https://chainlink21-pay-api.herokuapp.com/check/order/";
        string memory full_para;
        //full_para = concatenate(baseurl,_orderid);
        full_para = concatenate(orderurl,_orderid);
        req.add("get",full_para);
        req.add("path", "status_code");
        
        // Multiply the result by 1000000000000000000 to remove decimals
        //int timesAmount = 10**18;
        //req.addInt("times", timesAmount);
        
        // Sends the request
        point_level = 2;
        return sendChainlinkRequestTo(oracle, req, fee);
    }
    
    string public test_order_id ; //remove aftertesting
    
    function fulfill(bytes32 _requestId, bytes32 _status_code) public recordChainlinkFulfillment(_requestId)
    {
        test_order_id =  bytes32ToString(_status_code);
        string memory status_code = bytes32ToString(_status_code);
        point_level=2;
        address trans_token_add = allTransactions[status_code].token;
        uint256 sendingAmount = 0;
        point_level=2;
        uint256 trans_amount = allTransactions[status_code].amount;
        if(comparestrings(status_code,"0")){
            
            emit Transactionfailed(status_code,msg.sender,trans_token_add , trans_amount,'Sorry this transaction doesnt exist');
            
        }else{
            point_level=3;
          if(trans_token_add == swarmNGN_add){
                point_level=4;
                 // The rate gotten is USD/NGN
                sendingAmount = (trans_amount  * currentNGN_rate) / 10 ** 18;
                sendToken(status_code,trans_token_add,sendingAmount);
               
          }else{
                point_level=4;
                //The rate assumed to be ***/USDC 
                uint256 _tokenusdrate = 0 ;
                _tokenusdrate = getTokenUSDPrice(trans_token_add); 
                allowedTokens[trans_token_add].price = _tokenusdrate;
                sendingAmount = (trans_amount * 10 ** 18) /  _tokenusdrate;
                sendToken(status_code,trans_token_add,sendingAmount);
          }
        }
    }
    

     function requestNGNRate() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory req = buildChainlinkRequest(NGN_jobId, address(this), this.fulfillRate.selector);
        
        //string memory base_url = "https://chainlink21-pay-api.herokuapp.com/check/naira/";
        req.add("get",NGNrateurl);
        req.add("path", "NGN");
        
        // Multiply the result by 1000000000000000000 to remove decimals
        int timesAmount = 10**18;
        req.addInt("times", timesAmount);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, req, fee);
    }
    
   
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfillRate(bytes32 _requestId, uint256 _rateNGN) public recordChainlinkFulfillment(_requestId)
    {   
        
        //assign NGN rate to current NGN
        currentNGN_rate = _rateNGN;
        allowedTokens[swarmNGN_add].price = _rateNGN;
        
        
    }
    
    /** return the rate **/
    function getTokenUSDPrice(address token) public view returns (uint256) {
        address priceFeedAddress = tokenPriceFeedMapping[token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        uint256 tk_price = uint256(price) * 10**10;
        return tk_price;
        
        /*allowedTokens[token].price =  uint256(price) * 10**10;
        return allowedTokens[token].price;*/
    }
    
    
    
    
    // Utility functions for strings 
    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }
    
    //function to conctate strings
    function concatenate(string memory a , string memory b)internal pure returns(string memory){
       
      return string(abi.encodePacked(a,b));
        
    }
    //compare strings 
    function comparestrings(string memory a , string memory b) public pure returns (bool){
        if(keccak256(bytes(a)) == keccak256(bytes(b))){
            return true;
        }else{
            return false;
        }
    }

    
    
    
    
    
    
    

    
    /**
     * Withdraw LINK from this contract
     * 
     * NOTE: DO NOT USE THIS IN PRODUCTION AS IT CAN BE CALLED BY ANY ADDRESS.
     * THIS IS PURELY FOR EXAMPLE PURPOSES ONLY.
     */
    function withdrawLink() external onlyOwner{
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
    }
    function withdrawToken(address _token) external onlyOwner {
        require(IERC20(_token).transfer(msg.sender, IERC20(_token).balanceOf(address(this))),"unable to transfer");
    }
    
}

