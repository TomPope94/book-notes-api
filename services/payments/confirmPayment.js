export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log(event);
  console.log(data);
}
