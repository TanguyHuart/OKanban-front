import cardModule from './card.js';
import communModule from './commun.js';
import dragDropCards from './dragdropCards.js';
import dragDropLists from './dragdropLists.js';
// import makeListInDOM from './makeListInDOM.js';

const listModule = {

  // base_url: "",

  // setBaseUrl(url) {
  //   console.log(this);
  //   this.base_url = url
  // },
  /**
   * Ouverture de la popup en lui ajoutant la classe 'is-active'
   */
  showAddModal: () => {
    document.getElementById('listForm').reset();
    document.getElementById('addListModal').classList.add('is-active');
  },

  /**
 * - transforme le formulaire list en FormData
 * - fetch Post le résultat du formData
 * - appelle la fonction de création de list en fonction du resultat du fetch* - renvoie la fonction pour fermer la modale
 * @param {*} event 
 * @returns hideModals qui ferme toutes les modales
 */
  handleAddForm: async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);

      //je converti mon formData en JSON
      const object = {};
      formData.forEach((value, key) => object[key] = value);
      const json = JSON.stringify(object)
      // fetch POST a mon API , il faut préciser le content Type dans header pour que le json soit correctement lu
      const response = await fetch(communModule.base_url + '/lists', {
        headers: { "Content-Type": "application/json" },
        method: 'POST',
        body: json
      });
      if (response.ok) {
        const newList = await response.json();
        listModule.makeListInDOM(newList);
        return communModule.hideModals();
      }

    } catch (error) {
      console.error(error);
    }
  },


  /**
* Fonction qui permet de créer une List a partir du modele template, prend en argument le form  de créeation de list.
* @param {object} list
*/
  makeListInDOM: (list) => {

    // selon la doc le if permet de vérifier si template est pris en charge par le navigateur
    if ('content' in document.createElement('template')) {
      // on stocke le template
      const templateList = document.getElementById('list_template');

      // on stocke le parents de notre futur liste
      const cardListDiv = document.querySelector('.card-lists');

      //importNode permet de cloner un morceau de html, on clone le contenu de templateList 
      const templateClone = document.importNode(templateList.content, true);
      // on ajoute title au H2 du clone 
      const listName = templateClone.querySelector('h2')
      listName.textContent = list.name;
      listName.addEventListener('dblclick', communModule.showEditListForm);

      const editListNameForm = templateClone.querySelector('.edit-list-form');
      editListNameForm.addEventListener('submit', listModule.editListName)
      editListNameForm.querySelector('input').setAttribute('value', list.id)



      const listBox = templateClone.querySelector('.panel-block')
      listBox.addEventListener('dragenter', dragDropCards.dragEnterHandler)
      listBox.addEventListener('dragover', dragDropCards.dragOverHandler)
      listBox.addEventListener('drop', dragDropCards.dropHandler)
      listBox.addEventListener('dragleave', dragDropCards.dragLeaveHandler)

      const listPanel = templateClone.querySelector('.panel')
      listPanel.setAttribute('data-list-id', list.id);
      listPanel.setAttribute('data-list-position', list.position);

      listPanel.addEventListener('dragstart', dragDropLists.dragStartHandler)

      templateClone.querySelector('.add-list-button').addEventListener('click', cardModule.showAddCardModal);
      templateClone.querySelector('.delete-list-button').addEventListener('click', listModule.deleteList);


      // on insère le clone aavant tous les autres enfant du noeud
      cardListDiv.appendChild(templateClone);
    }
  },

  /**
   * Fonction qui permet l'edition du nom de la liste :
 * - creer un formData avec les valeurs du formulaire, le transforme en objet json
 * - fetch PATCH pour modifier la bdd des nouveles valeurs
 * - recupère la réponse et applique la modification dans le DOM
 * @param {SubmitEvent} event 
 * @returns la fonction qui permet de fermer toute les champs d'editions
 */
  editListName: async (event) => {

    try {
      event.preventDefault();

      const formData = new FormData(event.target);

      const object = {};
      formData.forEach((value, key) => object[key] = value);
      const json = JSON.stringify(object)
      console.log(object);
      // fetch POST a mon API , il faut préciser le content Type dans header pour que le json soit correctement lu
      const response = await fetch(communModule.base_url + '/lists/' + object.list_id, {
        headers: { "Content-Type": "application/json" },
        method: 'PATCH',
        body: json
      });
      if (response.ok) {
        const updatedList = await response.json();

        event.target.previousElementSibling.textContent = updatedList.name
        return communModule.hideEditListForm();
      }
    } catch (error) {
      console.error(error);
    }
  },

  deleteList: async (event) => {
    event.preventDefault();
    console.log(event.target);
    if (window.confirm(`Suppression de la carte ?`)) {
      const list_id = event.target.closest('[data-list-id]').getAttribute('data-list-id')

      const response = await fetch(communModule.base_url + '/lists/' + list_id, {
        method: 'DELETE',
      });
      if (response.ok) {
        document.querySelector(`div[data-list-id = '${list_id}']`).remove();
      }
    }
  }
};

export default listModule;
