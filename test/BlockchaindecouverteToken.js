var BlockchaindecouverteToken= artifacts.require("./BlockchaindecouverteToken.sol");

contract('BlockchaindecouverteToken', function(accounts){
    var tokenInstance;

    it('sets the good name', function(){
        return BlockchaindecouverteToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, 'BlockchaindecouverteToken', 'has the correct name');
        });
    })



    it('sets the total supply upon deployement', function(){
        return BlockchaindecouverteToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1 000 000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, 'admin balance has the total supply')
        });
    });

    it('transfers token ownership', function(){
        return BlockchaindecouverteToken.deployed().then(function(instance){
            tokenInstance = instance; 
            return tokenInstance.transfer.call(accounts[1], 9999999999999); //call appelle la fonction mais ne l'execute pas reellement sur la blockchain
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >=0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 10000, {from: accounts[0]});
        }).then(function(success){
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 10000, {from: accounts[0]});
        }).then(function(receipt){
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 10000, 'adds the amount to the receiving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 990000, 'remove the amount sent')
        })
    })

    it('approves tokens for delegated transfer', function(){
        return BlockchaindecouverteToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success){
            assert.equal(success, true, 'it returns true');
            return tokenInstance.approve(accounts[1], 100);
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for the delegated transfer');
        });
    });

    it('it handles delegated token transfers', function(){
        return BlockchaindecouverteToken.deployed().then(function(instance){
            tokenInstance = instance;
            fromAccount = accounts[2];;
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then(function(receipt){
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then(function(receipt){
            return tokenInstance.transferFrom(fromAccount, toAccount, 999, { from: spendingAccount });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >=0, 'cannot transfer value larger than the balance');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(success){
            assert.equal(success, true, 'is not succeed');
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
            return tokenInstance.balanceOf(fromAccount)
        }).then(function(balance){
            assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 10, 'adds the amount to the receiving account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        });
        
    })

    



})