export function safeRandom() {
  // https://kemilbeltre.medium.com/why-do-not-use-math-random-a6f8b0ad38dd
  // https://caniuse.com/cryptography
  const arr = new Uint32Array(1);

  crypto.getRandomValues(arr);

  return arr[0] * 2 ** -32;
}

export function randomString(length = 6) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = length; i > 0; i -= 1)
    result += chars[Math.floor(safeRandom() * chars.length)];

  return result;
}
