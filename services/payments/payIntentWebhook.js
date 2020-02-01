export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log(event);
  console.log(data);

  // need a switch for the type
  // need to work out how many slots were purchased
  // add those slots to the current count of the user
  // -------how do we know what customer the slots are for?????
}
