import communModule from './commun.js';
import dragDropCards from './dragdropCards.js'
import tagModule from './tag.js';
// import makeCardInDOM from './makeCardInDOM.js';

const cardModule = {

  // base_url: null,

  setBaseUrl(url) {
    this.base_url = url
  },
  /**
 * ouverture de la pop up en lui ajoutant la classe 'is-active', récupère la valeur de l'id de la liste pour l'attribuer dans le formulaire
 * @param {*} event 
 */
  showAddCardModal: (event) => {
    //  permet de récupérer l'id de la list a laquelle on veut rajouter une carte. event.target.closest(.panel) renvoie le premeir parent ayant .panel 
    document.getElementById('cardForm').reset();
    // récupère la valeur de data-list-id grance a dataset. et on transforme list-id en camelCase listId
    const list_id = event.target.closest('.panel').dataset.listId;

    // on attribue list_id à la value de l'input du formulaire par default
    document.getElementById('list_id').setAttribute('value', `${list_id}`);
    document.getElementById('addCardModal').classList.add('is-active');

  },

  /**
* - transforme le formulaire card en FormData
* - fetch Post le résultat du formData
* - appelle la fonction de création de card en fonction du resultat du fetch* - renvoie la fonction pour fermer la modale
* @param {*} event 
* @returns hideModals qui ferme toutes les modales
*/
  handleAddCardForm: async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);

      // on crée un objet dans lequel on va insérer toutes nos donnée de card : title, position, list_id 
      const object = {};
      formData.forEach((value, key) => object[key] = value);
      // la position de la carte est égale à la position de la carte précédente + 1
      object['position'] = communModule.getLastCardPosition(object.list_id) + 1;
      // on transforme l'objet en JSON pour qu'il puisse etre lu par l'API
      const json = JSON.stringify(object)
      console.log(json);
      // fetch POST pour crée une carte , avec l'objet json comme body : pour rappel , il y a title , position et list_id dedans
      const response = await fetch(communModule.base_url + '/cards', {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: json
      });
      //on transforme la réponse en élement lisible avec .json()
      const newCard = await response.json();

      cardModule.makeCardInDOM(newCard)
      return communModule.hideModals();
    } catch (error) {
      console.error(error);
    }
  },

  /**
* fonction qui crée une carte a partir du template, prend en argument le formulaire de addCard.
* @param {form} form
*/
  makeCardInDOM: (card) => {
    console.log(card);
    if ('content' in document.createElement('template')) {
      const templateCard = document.getElementById('card_template');

      //recupère la list ou il faut insérer la card grace à list_id
      const listToInsertCard = document.querySelector(`[data-list-id = '${card.list_id}'] .panel-block`);

      // clone le template 
      const templateClone = document.importNode(templateCard.content, true);

      //récupération de la carte avec .box et on stockes toute les données dans les data-card : id ,position, list_id

      const cardBoxclone = templateClone.querySelector('.box')
      cardBoxclone.style.backgroundColor = card.color;
      cardBoxclone.setAttribute('data-card-id', card.id);
      cardBoxclone.setAttribute('data-card-position', card.position)
      cardBoxclone.setAttribute('data-card-list_id', card.list_id)
      // ajour de l'evenement drag sur la carte créee.
      cardBoxclone.addEventListener('dragstart', dragDropCards.dragstartHandler);

      // recupération du formulaire d'edit de card afin de setup l'input caché de id 
      const cardFormClone = templateClone.querySelector('.edit-card-form')
      cardFormClone.addEventListener('submit', cardModule.editCard)
      cardFormClone.querySelector('input').setAttribute('value', card.id)

      // récupération du title afin de le changer le résultat du formulaire
      templateClone.querySelector('.card-title').textContent = card.title;

      // ajout des listener sur les bouton modify et delete
      templateClone.querySelector('.modify_card_button').addEventListener('click', communModule.showEditCardForm);
      templateClone.querySelector('.delete_card_button').addEventListener('click', cardModule.deleteCard)
      templateClone.querySelector('.associate_tag_button').addEventListener('click', tagModule.showAssociateTagForm)


      listToInsertCard.appendChild(templateClone);
    }
  },


  /**
   * fonction d'edition du contenu de la carte :
   * - creer un formData avec les valeurs du formulaire, le transforme en objet json
   * - fetch PATCH pour modifier la bdd des nouveles valeurs
   * - recupère la réponse et applique la modification dans le DOM
   * @param {SubmitEvent} event 
   * @returns la fonction qui permet de fermer toute les champs d'editions
   */
  editCard: async (event) => {

    try {
      event.preventDefault();

      const formData = new FormData(event.target);

      // création d'un objet afin de stocker les informaiton du formulaire
      const object = {};
      formData.forEach((value, key) => object[key] = value);
      const json = JSON.stringify(object)
      console.log(object);
      // fetch POST a mon API , il faut préciser le content Type dans header pour que le json soit correctement lu
      const response = await fetch(communModule.base_url + '/cards/' + object.id, {
        headers: { "Content-Type": "application/json" },
        method: 'PATCH',
        body: json
      });
      if (response.ok) {
        const updatedCard = await response.json();

        const cardHTML = event.target.closest('.box');
        cardHTML.querySelector('.card-title').textContent = updatedCard.title
        cardHTML.style["background-color"] = updatedCard.color
        return communModule.hideEditCardForm();
      }
    } catch (error) {
      console.error(error);
    }

  },

  /**
   * supprime la carte sur laquelle on a cliqué sur la poubelle :
   * - on récupère l'id de la carte
   * - fetch DELETE avec l'id
   * - si répponse , on remove la carte selon son id
   * @param {click} event 
   */
  deleteCard: async (event) => {
    event.preventDefault();
    if (window.confirm(`Suppression de la carte ?`)) {
      const card_id = event.target.closest('.box').getAttribute('data-card-id')

      const response = await fetch(communModule.base_url + '/cards/' + card_id, {
        method: 'DELETE',
      });
      if (response.ok) {
        document.querySelector(`div[data-card-id = '${card_id}']`).remove();
      }
    }
  }
};

export default cardModule;
