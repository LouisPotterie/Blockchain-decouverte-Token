var BlockchaindecouverteToken= artifacts.require("./BlockchaindecouverteToken.sol");

module.exports = function (deployer) {
  deployer.deploy(BlockchaindecouverteToken, 1000000);
};
