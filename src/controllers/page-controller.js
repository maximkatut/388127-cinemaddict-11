import CardComponent from "../components/card.js";
import FilmsListComponent from "../components/films-list.js";
import MoreButtonComponent from "../components/more-button.js";
import PopupBoardComponent from "../components/popup-board.js";
import PopupInfoComponent from "../components/popup-info.js";
import PopupControlsComponent from "../components/popup-controls.js";
import PopupCommentsComponent from "../components/popup-comments.js";
import {selectMostCommentedCards, selectTopCards} from "../utils/cardsSelector.js";
import {RenderPosition, render, remove} from "../utils/render.js";

export default class PageController {
  constructor(container) {
    this._container = container;

    this._mainFilmsListComponent = new FilmsListComponent(`All movies. Upcoming`, false, false);
    this._mainNoFilmsListComponent = new FilmsListComponent(`There are no movies in our database`, true, false);
    this._topFilmsListComponent = new FilmsListComponent(`Top rated`, true, true);
    this._mostCommentedFilmsListComponent = new FilmsListComponent(`Most commented`, true, true);

    this._popupBoardComponent = new PopupBoardComponent();
    this._moreButtonComponent = new MoreButtonComponent();
  }

  render(cards) {
    const CARDS_COUNT_ON_START = 5;
    const CARDS_COUNT_LOAD_MORE_BUTTON = 5;

    const container = this._container.getElement();

    // Rendering card function
    const renderCard = (cardsListElement, card) => {
      // Handler for each filmCard to open popup
      const onOpenPopupClick = () => {
        // Render popup of active filmcard
        renderPopup(card);
      };
      // Rendering the actual card
      const cardComponent = new CardComponent(card);
      render(cardsListElement, cardComponent, RenderPosition.BEFOREEND);
      // Add listeners for poster, name and comments to open popup
      cardComponent.setOpenPopupHandler(onOpenPopupClick);
    };
      // Rendering popup function
    const renderPopup = (card) => {
      // Check if popup allready open than remove it
      let popupBoardElement = document.querySelector(`.film-details`);
      if (popupBoardElement) {
        remove(this._popupBoardComponent);
      }
      // Handler to close popup with ESC
      const onKeyDown = (evt) => {
        const isEscapeKey = evt.key === `Esc` || evt.key === `Escape`;
        if (isEscapeKey) {
          remove(this._popupBoardComponent);
        }
        document.removeEventListener(`keydown`, onKeyDown);
      };
        // Handler to close popup with click on cross button
      const onCloseButtonClick = () => {
        remove(this._popupBoardComponent);
      };

      popupBoardElement = this._popupBoardComponent.getElement();
      const sitePopupContainer = popupBoardElement.querySelector(`.form-details__top-container`);
      const sitePopupCommentsContainer = popupBoardElement.querySelector(`.film-details__inner`);
      const siteBodyElement = document.querySelector(`body`);

      render(siteBodyElement, this._popupBoardComponent, RenderPosition.BEFOREEND);
      render(sitePopupContainer, new PopupInfoComponent(card), RenderPosition.BEFOREEND);
      render(sitePopupContainer, new PopupControlsComponent(card), RenderPosition.BEFOREEND);
      render(sitePopupCommentsContainer, new PopupCommentsComponent(card.comments), RenderPosition.BEFOREEND);

      this._popupBoardComponent.setClosePopupClickHandler(onCloseButtonClick);
      document.addEventListener(`keydown`, onKeyDown);
    };
    // Rendering board function
    const renderFilmsLists = (filmsBoardElement) => {
      // Check if cards.length === 0 do not render them and change the title
      if (cards.length === 0) {
        render(filmsBoardElement, this._mainNoFilmsListComponent, RenderPosition.BEFOREEND);
        this._mainNoFilmsListComponent.getListInnerElement().remove();
        return;
      }
      // render main list of films
      render(filmsBoardElement, this._mainFilmsListComponent, RenderPosition.BEFOREEND);
      // Render LoadMoreButtonComponent
      render(this._mainFilmsListComponent.getElement(), this._moreButtonComponent, RenderPosition.BEFOREEND);
      // render cards
      let showingCardsCount = CARDS_COUNT_ON_START;
      cards
        .slice(0, showingCardsCount)
        .forEach((card) => renderCard(this._mainFilmsListComponent.getListInnerElement(), card));
      // removeMoreButton function if no more cards hidden
      const removeMoreButton = () => {
        if (showingCardsCount >= cards.length) {
          remove(this._moreButtonComponent);
        }
      };
      // Remove moreButton if at the start has less than 5 cards
      removeMoreButton();

      // Render cards and cards that showing `CARDS_COUNT_LOAD_MORE_BUTTON` cards by click show more button
      this._moreButtonComponent.setClickHandler(() => {
        const showedCardsCount = showingCardsCount;
        showingCardsCount += CARDS_COUNT_LOAD_MORE_BUTTON;
        cards
          .slice(showedCardsCount, showingCardsCount)
          .forEach((card) => renderCard(this._mainFilmsListComponent.getListInnerElement(), card));
        removeMoreButton();
      });

      // if topRatedCards or mostCommentedCards === 0 => do not render them
      // Render top rated films
      if (topRatedCards.length > 0) {
        render(filmsBoardElement, this._topFilmsListComponent, RenderPosition.BEFOREEND);
        topRatedCards.forEach((card) => {
          renderCard(this._topFilmsListComponent.getListInnerElement(), card);
        });
      }
      // Render most commented films
      if (mostCommentedCards.length > 0) {
        render(filmsBoardElement, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
        mostCommentedCards.forEach((card) => {
          renderCard(this._mostCommentedFilmsListComponent.getListInnerElement(), card);
        });
      }
    };

    const topRatedCards = selectTopCards(cards);
    const mostCommentedCards = selectMostCommentedCards(cards);

    // Render main filmsList with cards
    renderFilmsLists(container);
  }
}