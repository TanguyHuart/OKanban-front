
const communModule = {

  base_url: 'http://localhost:3000',

  /**
   * fermeture de toute les pop Up
   */
  hideModals: () => {
    document.querySelectorAll('.modal').forEach(element => element.classList.remove('is-active'));
  },
  /**
   * Ouverture du champ d'edition de la liste
   * @param {dblclick} event 
   */
  showEditListForm: (event) => {
    console.log(event.target);
    event.target.classList.add('is-hidden');
    event.target.nextElementSibling.classList.remove('is-hidden');
  },
  /**
   * fermeture du champ d'edition de la liste, est appelée à la fin de l'edition si tou s'est bien passé
   * @param {}
   */
  hideEditListForm: () => {
    document.querySelectorAll('.edit-list-form').forEach(element => element.classList.add('is-hidden'));
    document.querySelectorAll('h2').forEach(element => element.classList.remove('is-hidden'));
  },
  /**
   * Ouverture du champ d'edition de la liste
   * @param {click} event 
   */
  showEditCardForm: (event) => {
    const cardBox = event.target.closest('.box')
    cardBox.querySelector('.edit-card-form').classList.remove('is-hidden');
    cardBox.querySelector('.column').classList.add('is-hidden')
  },
  /**
   * fermeture du champ d'edition de la carte, est appelée à la fin de l'edition si tou s'est bien passé
   * @param {}
   */
  hideEditCardForm: () => {
    document.querySelectorAll('.edit-card-form').forEach(element => element.classList.add('is-hidden'));
    document.querySelectorAll('.box .card-title').forEach(element => element.classList.remove('is-hidden'));
  },

  // retourne la position de la derniere carte de la liste ciblée
  getLastCardPosition: (list_id) => {
    if (document.querySelector(`[data-list-id = '${list_id}'] .panel-block`).lastElementChild) {
      return parseInt(document.querySelector(`[data-list-id = '${list_id}'] .panel-block`).lastElementChild.getAttribute('data-card-position'))
    } else {
      return 0;
    }

  },

  /**
   * Fonction qui permet de gérer deux route distincte dans la selection des cartes : les  cartes dans la liste de départ et les cartes dans la liste d'arrivée
   * 1. création d'un tableau cards qui accueille toutes les cartes déja présente dans la liste (de départ ou d'arrivée en fonction de list_id)
   * 2. .filter sur le tableau afin de ne garder que les cards ayant une position supérieure (ou égale si on gère la liste d'arrivée)  à la carte qui va être drop.
   * @param {number} list_id de la liste a laquelle on veut récupérer les cartes
   * @param {object} card cartes qui est en train d'etre déplacée
   * @param {string} previousOrNextList 'string pour spécifier si on rentre dans la gestion des position des cartes de la liste de départ ou d'arrivée
   * @param {number} previousPosition la position de la carte avant son drag
   * @returns 
   */
  getAllNextCards: (list_id, card, previousOrNextList, previousPosition) => {

    // 1 <----
    const cards = []
    document.querySelectorAll(`[data-list-id = '${list_id}'] .box`).forEach(element => cards.push(element))

    // 2  <---
    if (previousOrNextList == 'previous') {
      console.log(cards);
      console.log("Ici on passe dans la branche 'previous' du getAllcards");
      const nextcards = cards.filter(element => element.getAttribute('data-card-position') > previousPosition && element.getAttribute('data-card-id') != card.id)
      console.log(nextcards);
      return nextcards;
    } else {
      console.log("Ici on passe dans la branche 'next' du getAllcards");
      const nextcards = cards.filter(element => element.getAttribute('data-card-position') >= card.position && element.getAttribute('data-card-id') != card.id)

      return nextcards;
    }

  },

};

export default communModule