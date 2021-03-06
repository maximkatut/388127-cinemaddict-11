import AbstractComponent from "./abstract-component.js";
import {ActiveScreen} from "../const.js";


const createFilterMarkup = (filter, checked) => {
  let {count} = filter;
  const {name} = filter;
  if (name === `All movies`) {
    count = 0;
  }
  const hiddenClass = (count === 0) ? `visually-hidden` : ``;
  const activeClass = (checked) ? `main-navigation__item--active` : ``;
  return `<a href="#${name.toLowerCase()}" class="main-navigation__item ${activeClass}">${name} <span class="main-navigation__item-count ${hiddenClass}">${count}</span></a>`;
};

const createFiltersTemplate = (filters) => {
  const navigationMarkup = filters.map((filter) => {
    return createFilterMarkup(filter, filter.checked);
  }).join(`\n`);
  return (
    `<div class="main-navigation__items">
      ${navigationMarkup}
    </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._currentFilterType = ``;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }
      const filterType = evt.target.innerText.split(/\s\d/)[0];
      if (this._currentFilterType === filterType) {
        return;
      }
      this._currentFilterType = filterType;
      handler(this._currentFilterType);
    });
  }

  setActiveScreenChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler(ActiveScreen.MOVIES);
    });
  }
}
