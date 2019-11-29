import axios from 'axios';
// import { success, failure } from '../../libs/response-lib';

export async function main(event) {
  const data = JSON.parse(event.body);
  const params = {
    title: data.bookTitle,
    author: data.bookAuthor,
    key: process.env.googleBooksKey
  };
  const searchURL = `https://www.googleapis.com/books/v1/volumes?q=intitle:${params.title}+inauthor:${params.author}&key=${params.key}`;

  try {
    const res = await axios.get(searchURL);
    const searchResult = res.data.items.map(item => {
      const output = {
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        published: item.volumeInfo.publishedDate,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories,
        image: item.volumeInfo.thumbnail,
        language: item.volumeInfo.language
      };

      return output;
    });
    return {
      statusCode: 200,
      body: JSON.stringify(searchResult)
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err)
    };
  }
}
