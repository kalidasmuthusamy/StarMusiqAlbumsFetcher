import axios from 'axios';
import fs from 'fs';

const downloadImage = async(imageUrl, filePath) => {
  try{
    const response = await axios({
      url: imageUrl,
      responseType: 'stream',
    });

    await response.data.pipe(fs.createWriteStream(filePath));
    return {
      status: true,
      error: ''
    };
  } catch(e) {
    return {
      status: false,
      error: e.message,
    }
  }
};

export default downloadImage;
