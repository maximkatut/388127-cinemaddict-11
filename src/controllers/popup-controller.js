import PopupCommentsComponent from "../components/popup-comments.js";
import PopupComponent from "../components/popup.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";


export default class PopupController {
  constructor(onDataChange, onViewChange) {
    this._card = {};
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._popupComponent = null;
    this._popupCommentsComponent = null;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);

    this._selectedEmoji = ``;
  }

  render(card) {
    this._card = card;
    this._onViewChange();
    const oldPopupComponent = this._popupComponent;
    // Find body element for rendering popup card
    const siteBodyElement = document.querySelector(`body`);
    this._popupComponent = new PopupComponent(this._card);
    this._popupCommentsComponent = new PopupCommentsComponent(this._card.comments);
    if (oldPopupComponent) {
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupCommentsContainer(), this._popupCommentsComponent, RenderPosition.BEFOREEND);
    }
    // set click event for popup close button and Esc key
    this._popupComponent.setClosePopupClickHandler(this._onCloseButtonClick);

    this._popupComponent.setWatchlistClickHandler(() => {
      this._onDataChange(this._card, Object.assign({}, this._card, {
        isInWatchlist: !this._card.isInWatchlist
      }));
    });
    this._popupComponent.setWatchedClickHandler(() => {
      this._onDataChange(this._card, Object.assign({}, this._card, {
        isWatched: !this._card.isWatched
      }));
    });
    this._popupComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this._card, Object.assign({}, this._card, {
        isFavorite: !this._card.isFavorite
      }));
    });
    this._popupCommentsComponent.setChangeEmojiClickHandler((evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._selectedEmoji = evt.target.value;
      this._popupCommentsComponent.setNewCommentEmojiImg(this._selectedEmoji);
      this._popupCommentsComponent.rerender();
    });

    document.addEventListener(`keydown`, this._onKeyDown);
  }

  // Handler to close popup with click on cross button
  _onCloseButtonClick() {
    remove(this._popupComponent);
  }

  // Handler to close popup with ESC
  _onKeyDown(evt) {
    const isEscapeKey = evt.key === `Esc` || evt.key === `Escape`;
    if (isEscapeKey) {
      remove(this._popupComponent);
    }
    document.removeEventListener(`keydown`, this._onKeyDown);
  }

  destroy() {
    if (this._popupComponent) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onKeyDown);
    }
  }
}