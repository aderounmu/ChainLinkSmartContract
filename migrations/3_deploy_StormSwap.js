const StormNGNToken = artifacts.require("StormNGNToken");
const StormSwap = artifacts.require("StormSwap");

module.exports = async function(deployer, network, accounts) {
  // Deploy stormSwap
  const stormNGNToken = await StormNGNToken.deployed();
  await deployer.deploy(
    StormSwap, 
    stormNGNToken.address,
    process.env.ORDERURL,
    process.env.RATEURL,
    process.env.ORACLE,
    process.env.TRAN_JOBID,
    process.env.NGN_JOBID
    );
  const stormSwap = await StormSwap.deployed();
  await stormNGNToken.transfer(stormSwap.address, "1000000000000000000000000");

  if (network.startsWith("rinkeby") || network.startsWith("live")) {
    // LINK Token address in rinkeby
    await stormSwap.addAllowedTokens(
      "0x01be23585060835e02b77ef475b0cc51aa1e0709"
    );
    await stormSwap.setPriceFeedContract(
      "0x01be23585060835e02b77ef475b0cc51aa1e0709",
      "0xd8bD0a1cB028a31AA859A21A3758685a95dE4623"
    );
    // FAU Token address. Pretending FAU is DAI in rinkeby
    await stormSwap.addAllowedTokens(
      "0xFab46E002BbF0b4509813474841E0716E6730136"
    );
    await stormSwap.setPriceFeedContract(
      "0xFab46E002BbF0b4509813474841E0716E6730136",
      "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB"
    );
    // the storm token that is pegged to the Naira
    await stormSwap.addAllowedTokens(stormNGNToken.address);
    // await stormSwap.setPriceFeedContract(
    //   stormNGNToken.address,
    //   "0x777A68032a88E5A84678A77Af2CD65A7b3c0775a"
    // );
  }
};
