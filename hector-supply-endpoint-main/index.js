const ethers = require("ethers");
const express = require("express");

const totalSupplyABI = {
  inputs: [],
  name: "totalSupply",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function",
};
const HECCirculatingSupply = {
  inputs: [],
  name: "HECCirculatingSupply",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function",
};

const port = 3000;
const ftmRpc = "https://rpc.ftm.tools";
const hecERC20 = "0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0";
const circSupply = "0x5a0325d0830f10044D82044fd04223F2E0Ea5047";
const wshecERC20 = "0x94CcF60f700146BeA8eF7832820800E2dFa92EdA";

const provider = new ethers.providers.JsonRpcProvider(ftmRpc);
const hecContract = new ethers.Contract(hecERC20, [totalSupplyABI], provider);
const circSupplyContract = new ethers.Contract(circSupply, [HECCirculatingSupply], provider);
const wshecContract = new ethers.Contract(wshecERC20, [totalSupplyABI], provider);

let totalSupply = 0;
let circulatingSupply = 0;
let wsHECSupply = 0;

const fetchSupply = async () => {
  totalSupply = (await hecContract.totalSupply()) / Math.pow(10, 9);
  circulatingSupply = (await circSupplyContract.HECCirculatingSupply()) / Math.pow(10, 9);
  wsHECSupply = (await wshecContract.totalSupply()) / Math.pow(10, 18);
  console.log(circulatingSupply, "/", totalSupply, wsHECSupply);
};

fetchSupply();
setInterval(fetchSupply, 1000 * 300);

const app = express();

app.get("/totalSupply", (req, res) => {
  res.send(`${totalSupply}`);
});

app.get("/circulatingSupply", (req, res) => {
  res.send(`${circulatingSupply}`);
});

app.get("/wsHECtotalSupply", (req, res) => {
  res.send("500000");
});

app.get("/wsHECcirculatingSupply", (req, res) => {
  res.send(`${wsHECSupply}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
