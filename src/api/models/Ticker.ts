export abstract class Ticker {
  public static newTicker(): string {
    return getDate();
  }
}

function getDate() {
  const date = new Date();
  const yy = date.getFullYear().toString().slice(-2);
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');

  let randomChars = '';
  for (let i = 0; i < 4; i++) {
    randomChars += String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }

  return `${yy}${mm}${dd}-${randomChars}`;
}
