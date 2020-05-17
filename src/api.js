import Card from "./models/card.js";

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getCards() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
      .then((response) => response.json())
      .then(Card.parseCards);
  }
};

export default API;
