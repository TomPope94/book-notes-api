import axios from 'axios';
import { success, failure } from '../../libs/response-lib';

export async function main(event) {
  const data = JSON.parse(event.body);

  const params = {
    title: data.bookTitle,
    author: data.bookAuthor,
    key: process.env.booksAPIKey,
  };

  const titleString = params.title.length > 0 ? `${params.title}` : '';
  const authorString = params.author.length > 0 ? `${params.author}` : '';

  const searchURL = `https://api2.isbndb.com/search/books?text=${titleString}&author=${authorString}`;

  const config = {
    headers: {
      Host: 'api2.isbndb.com',
      'User-Agent': 'insomnia/5.12.4',
      Authorization: params.key,
      Accept: '*/*',
    },
  };

  console.log('The key is: ' + params.key);

  try {
    const res = await axios.get(searchURL, config);
    console.log(res);
    const searchResult = res.data.data.map((item) => {
      const output = {
        volumeId: item.isbn,
        title: item.title,
        authors: item.authors,
        published: item.publish_date,
        pageCount: item.pages,
        image: item.image,
        language: item.language,
      };

      return output;
    });
    return success(searchResult);
  } catch (err) {
    return failure({ status: false, error: err.message });
  }
}
