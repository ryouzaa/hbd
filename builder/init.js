const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const setPic = require("./getPic");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

require("dotenv").config();

if (!process.env.NAME) throw new Error("Please specify NAME in environment.");
if (!process.env.PIC) throw new Error("Please specify PIC in environment.");

const picPath = "https://instagram.fjog3-1.fna.fbcdn.net/v/t51.2885-19/327175868_2594372777369555_408525985531825408_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fjog3-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=Gp_0pGtDnJEAX-nh3vF&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfB1WHQwWk_NMdeVfX0l7lW_vHEF04DATUzOdi6FERjxZw&oe=63DE101A&_nc_sid=8fd12b";
const msgPath = "https://api.telegra.ph/getPage/Selamat-Ulang-Tahun-Ke-22-01-31?return_content=true";

//Local initialization
const setLocalData = async () => {
  try {
    const pic = path.join(__dirname, "../local/", picPath);
    let markup = "";
    if (msgPath) {
      const text = fs.readFileSync(path.join(__dirname, "../local/", msgPath), {
        encoding: "utf-8",
      });
      markup = generateMarkupLocal(text);
    }
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

//Remote initialization
const setRemoteData = async () => {
  try {
    let res = await axios.get(picPath, {
      responseType: "arraybuffer",
    });
    const pic = res.data;
    let markup = "";
    if (msgPath) {
      const article = msgPath.split("/").pop();
      res = await axios.get(
        "https://api.telegra.ph/getPage/Selamat-Ulang-Tahun-Ke-22-01-31?return_content=true"
      );
      const { content } = res.data.result;
      markup = content.reduce(
        (string, node) => string + generateMarkupRemote(node),
        ""
      );
    }
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

if (process.argv[2] === "--local") setLocalData();
else if (process.argv[2] === "--remote") setRemoteData();
else console.log("Fetch mode not specified.");
