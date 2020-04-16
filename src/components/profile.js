import {createElement} from "../utils/render.js";
import {RANK_NAMES} from "../const.js";

const createProfileMarkup = (count) => {
  let rank = ``;
  if (count > 20) {
    rank = RANK_NAMES[2];
  } else
  if (count <= 20 && count > 10) {
    rank = RANK_NAMES[1];
  } else
  if (count <= 10) {
    rank = RANK_NAMES[0];
  } else
  if (count === 0) {
    rank = ``;
  }
  return `<p class="profile__rating">${rank}</p>`;
};

const createProfileTemplate = (count) => {
  return (`
    <section class="header__profile profile">
    ${createProfileMarkup(count)}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`);
};

export default class Profile {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
