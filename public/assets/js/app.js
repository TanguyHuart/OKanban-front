import listModule from './list.js';
import cardModule from './card.js';
import communModule from './commun.js';
import tagModule from './tag.js';
// import makeListInDOM from './makeListInDOM.js';
// import makeCardInDOM from './makeCardInDOM.js';


// on objet qui contient des fonctions
const app = {

  // fonction d'initialisation, lancée au chargement de la page
  init: () => {
    console.log('app.init !');
    // listModule.setBaseUrl(app.base_url);
    // cardModule.setBaseUrl(app.base_url);

    app.addListenerToActions();
    app.createListsHomePage();

  },

  /**
   * Fonction qui centralise tous les listener à initialiser au chargement de la page
   */
  addListenerToActions: () => {
    // evenement sur le button 'creer une liste' qui fait apparaitre la modale
    document.getElementById('addListButton').addEventListener('click', listModule.showAddModal);

    // evenement click sur tous les boutons + pour ajouter une card , fait apparaitre la modale addCard
    document.querySelectorAll('.is-pulled-right').forEach(element => element.addEventListener('click', cardModule.showAddCardModal));
    // evenement click sur les boutons x et close pour fermer les modales
    document.querySelectorAll('.close').forEach(element => element.addEventListener('click', communModule.hideModals));
    //evenement submit sur le formulaire List 
    document.getElementById('listForm').addEventListener('submit', listModule.handleAddForm);
    // evenement submit sur le formulaire card
    document.getElementById('cardForm').addEventListener('submit', cardModule.handleAddCardForm);
    //evenement sur le double click des nom des lists
    document.querySelectorAll('h2').forEach(element => {
      element.addEventListener('dblclick', communModule.showEditListForm)
      // evenement sur le click du bouton modifier la carte
      document.querySelectorAll('.modify_card_button').forEach(element => element.addEventListener('click', communModule.showEditCardForm))


    });
    document.getElementById('tagForm').addEventListener('submit', tagModule.associateTagToCard)


  },

  getListFromAPI: async () => {
    try {
      const response = await fetch(communModule.base_url + '/lists');
      const lists = response.json();
      return lists
    } catch (error) {
      console.error(error);
    }
  },

  createListsHomePage: async () => {
    try {

      const lists = await app.getListFromAPI();
      for (const list of lists) {
        listModule.makeListInDOM(list)
        for (const card of list.card) {
          cardModule.makeCardInDOM(card)
          for (const tag of card.tags) {
            tagModule.makeTagInDOM(tag)
          }
        }
      }
    } catch (error) {
      console.error(error);
    }

  },

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);