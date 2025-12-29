import dotenv from "dotenv";
dotenv.config();

import ImageKit from "imagekit";

var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;

// const client = new ImageKit({
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
// });

// const response = await client.files.upload({
//   file: fs.createReadStream("path/to/file"),
//   fileName: "file-name.jpg",
// });

// console.log(response);
