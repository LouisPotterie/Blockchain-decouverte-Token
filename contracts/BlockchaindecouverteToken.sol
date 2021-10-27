// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BlockchaindecouverteToken {

    //Constructor
    //Nombre total de tokens 
    //Lire le nombre total de token 

    mapping(address => uint256) public _balances;
    mapping(address => mapping(address => uint256)) _allowed; // Account A approves Account X for an amount N 
    
    string public name = "BlockchaindecouverteToken";
    string public symbol = "BDT";
    uint256 public _totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );


    constructor(uint256 _initialSupply) {
        
        _totalSupply = _initialSupply;
        //allocate the initial supply
        _balances[msg.sender] = _totalSupply;

    }

    function totalSupply() public view returns (uint){
        return _totalSupply;
    }

    
    function balanceOf(address _owner) public view returns(uint256){
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns(bool success){
        require(_balances[msg.sender] >= _value); //if require is true continue the fct if not throw an error
        
        //Transfer
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value); //Trigger the event, event stores the log

        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining){

        return _allowed[_owner][_spender];

    }

    function approve(address _spender, uint256 _value) public returns(bool success){
        
        _allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        
        //pré-requis pour le transfert, stop si pré-requis ne sont pas remplies
        require(_value <= _balances[_from]);
        require(_value <= _allowed[_from][msg.sender]);

        //Transfer

        _balances[_from] -= _value;
        _balances[_to] += _value;

        //Updated allowance
        _allowed[_from][msg.sender] -= _value;
        
        //Trigger the Transfer event
        emit Transfer(_from, _to, _value);
        return true;
    }

   

    




}