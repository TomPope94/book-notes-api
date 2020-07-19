import axios from 'axios';
import { success, failure } from '../../libs/response-lib';

export async function main(event) {
  const data = JSON.parse(event.body);

  const params = {
    title: data.bookTitle,
    author: data.bookAuthor,
    key: process.env.googleBooksKey,
  };

  const titleString = params.title.length > 0 ? `intitle:${params.title}` : '';
  const authorString =
    params.author.length > 0 ? `inauthor:${params.author}` : '';

  const searchURL = `https://www.googleapis.com/books/v1/volumes?q=${titleString}+${authorString}&key=${params.key}`;

  try {
    const res = await axios.get(searchURL);
    const searchResult = res.data.items.map((item) => {
      const output = {
        volumeId: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        published: item.volumeInfo.publishedDate,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories,
        image: item.volumeInfo.imageLinks,
        language: item.volumeInfo.language,
      };

      return output;
    });
    return success(searchResult);
  } catch (err) {
    return failure({ status: false });
  }
}
