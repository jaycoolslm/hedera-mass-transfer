const fs = require("fs");

function generateJson(serial) {
  const jsonObject = {
    address: "0.0.552054",
    serial,
  };

  fs.writeFile(
    `json/file_${serial}.json`,
    JSON.stringify(jsonObject, null, 2),
    (err) => {
      if (err) throw err;
      console.log(`File with serial number ${serial} has been saved.`);
    }
  );
}

for (let i = 200; i < 210; i++) {
  generateJson(i);
}
