const fs = require("fs");
require("dotenv").config();

fs.writeFileSync(
  "./.env",
  `
  PRIVATE_KEY=${process.env.PRIVATE_KEY}\n 
  SNOWTRANCE_API_KEY=${process.env.SNOWTRANCE_API_KEY}\n
  REACT_APP_PINATA_API_KEY=${process.env.REACT_APP_PINATA_API_KEY}\n
  REACT_APP_PINATA_SECRET_API_KEY=${process.env.REACT_APP_PINATA_SECRET_API_KEY}\n
  REACT_APP_PINATA_JWT=${process.env.REACT_APP_PINATA_JWT}\n
  REACT_APP_MORALIS_API_KEY=${process.env.REACT_APP_MORALIS_API_KEY}\n
  `
);
