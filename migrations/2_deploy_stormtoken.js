const StormNGNToken = artifacts.require('StormNGNToken')

module.exports = async function(deployer, network, accounts) {
  // Deploy Dapp Token
  await deployer.deploy(StormNGNToken)
  const stormNGNToken = await StormNGNToken.deployed()
}
