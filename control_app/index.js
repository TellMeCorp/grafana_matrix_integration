const fs = require("fs").promises;
const jose = require("node-jose");

try {
  async () => {
    const stat = await fs.lstat("../src/Keys.json");
    if (stat.isFile()) {
      console.log("has");
    }
  };
} catch (error) {
  const fs = require("fs");
  let keyStore = jose.JWK.createKeyStore();

  keyStore
    .generate("RSA", 2048, { alg: "RS256", use: "sig" })
    .then((result) => {
      fs.writeFileSync(
        "../src/Keys.json",
        JSON.stringify(keyStore.toJSON(true), null, "  ")
      );
    });
}
