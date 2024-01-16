import communModule from "./commun.js";
import dragDropLists from "./dragdropLists.js";

const dragDropCards = {

  /**
   * fonction de levenement dragStart :
   * - on enleve le dragStart lié au listes
   * - on ajoute les events lié au drag de la carte
   * - crée un objet dataCard pour stocker les information de la carte
   * - le trasforme en json pour etre transféré via le drag
   * - ajoute le json a la 'mémoire" dataTransfer pour le retouver lors du drop 
   * @param {dragstart} event 
   */
  dragstartHandler: async (event) => {
    event.stopPropagatioLists
    document.querySelectorAll('.panel').forEach(element => {
      element.removeEventListener('dragstart', dragDropLists.dragStartHandler)

      document.querySelector('.card-lists').addEventListener('dragend', dragDropCards.dragEndHadler)
      document.querySelectorAll('.panel-block').forEach(element => {
        element.addEventListener('dragenter', dragDropCards.dragEnterHandler)
        element.addEventListener('dragover', dragDropCards.dragOverHandler)
        element.addEventListener('dragleave', dragDropCards.dragLeaveHandler)
        element.addEventListener('drop', dragDropCards.dropHandler)
      })
    })
    const dataCard = {
      id: parseInt(event.target.getAttribute('data-card-id')),
      position: parseInt(event.target.getAttribute('data-card-position')),
      list_id: parseInt(event.target.getAttribute('data-card-list_id'))

    }
    const json = JSON.stringify(dataCard)
    event.dataTransfer.setData('cardData', json)


  },
  /**
   * Fonction de l'evenement dragenter sur la div qui contient les cartes :
   * - preventDefault() obligatoire sinon le drag ne peut pas se faire
   * - ajoute un background a la liste pour notifier la drop zone
   * @param {dragenter} event 
   */
  dragEnterHandler: async (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.target.closest('.panel').style["background"] = 'blueviolet'

    if (event.target.closest('.box')) {
      event.target.closest('.box').style["border-bottom"] = '5px solid black'
    } else {
      event.target.previousElementSibling.style["border-bottom"] = '5px solid black'
    }


  },

  /**
 * Fonction de l'evenement dragover sur la div qui contient les cartes :
 * - preventDefault() obligatoire sinon le drag ne peut pas se faire
 * - ajoute un background a la liste pour notifier la drop zone
 * @param {dragover} event 
 */
  dragOverHandler: async (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.target.closest('.panel').style["background"] = 'blueviolet'



    if (event.target.closest('.box')) {
      event.target.closest('.box').style["border-bottom"] = '5px solid black'
    } else {
      event.target.previousElementSibling.style["border-bottom"] = '5px solid black'
    }

  },
  /**
   * Fonction de l'evenement dragleave sur la div qui contient les cartes :
   * - preventDefault() obligatoire sinon le drag ne peut pas se faire
   * - enleve le background a la liste
   * @param {dragleave} event 
   */
  dragLeaveHandler: async (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.target.closest('.panel').style['background'] = ''

    if (event.target.closest('.box')) {
      event.target.closest('.box').style["border-bottom"] = ''
    } else {
      event.target.previousElementSibling.style["border-bottom"] = ''
    }

  },

  dragEndHadler: async (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.target.closest('.panel').style['background'] = ''

    if (event.target.closest('.box')) {
      event.target.closest('.box').style["border-bottom"] = ''
    } else {
      event.target.previousElementSibling.style["border-bottom"] = ''
    }

    // fin du dragDrop de carte : on remoet tous les listeler lié dragdrop de listes
    document.querySelectorAll('.panel').forEach(element => {
      element.addEventListener('dragstart', dragDropLists.dragStartHandler)
    })
    document.querySelector('.card-lists').removeEventListener('dragend', dragDropCards.dragEndHadler)
    document.querySelectorAll('.panel-block').forEach(element => {
      element.removeEventListener('dragenter', dragDropCards.dragEnterHandler)
      element.removeEventListener('dragover', dragDropCards.dragOverHandler)
      element.removeEventListener('dragleave', dragDropCards.dragLeaveHandler)
      element.removeEventListener('drop', dragDropCards.dropHandler)
    })
  },


  /**
   * voila la fonction lors du drop de la carte :
   * on remet l'event dragstart sur les listes, et onenlève les evenenemt de drag lié aux cartes
   * suppréssion du style pour savoir ou on met la carte
   * récupération du datatransfer, récupération de l'id de la liste de départ qui sera utile pour changer la position des cartes
   * récupération de l'id de la liste d'arrivée
   * récupération de la carte qui a été déplacée gràace a son id stockée deans le datatransfert
   * ajout de la carte a la nouvelle liste
   * QueryselectorAll sur les cartes de la liste d'arrivée : puis pour chaque carte , on lui change sa position et fetch les nouvelle donnée dans la bdd
   * IDEM pour les carte de la listes de départ.
   * @param {drop} event 
   */
  dropHandler: async (event) => {
    event.stopPropagation();

    //on remet l'event dragstart des lists
    document.querySelectorAll('.panel').forEach(element => {
      element.addEventListener('dragstart', dragDropLists.dragStartHandler)

    })
    // on enleves les events de drag des cartes
    document.querySelector('.card-lists').removeEventListener('dragend', dragDropCards.dragEndHadler)
    document.querySelectorAll('.panel-block').forEach(element => {
      element.removeEventListener('dragenter', dragDropCards.dragEnterHandler)
      element.removeEventListener('dragover', dragDropCards.dragOverHandler)
      element.removeEventListener('dragleave', dragDropCards.dragLeaveHandler)
      element.removeEventListener('drop', dragDropCards.dropHandler)
    })


    try {
      // suppression des effets de styles
      event.target.closest('.panel').style['background'] = ''
      if (event.target.closest('.box')) {
        event.target.closest('.box').style["border-bottom"] = ''
      } else {
        event.target.previousElementSibling.style["border-bottom"] = ''
      }

      // récupération du data trasfert
      const dataCard = JSON.parse(event.dataTransfer.getData('cardData'));
      // récupération de l'ancienne list_id avant son changement
      const previousList = dataCard.list_id


      // récupère id de la nouvelle liste pour la mettre dans la requete fetch
      const newList_id = event.target.closest('.panel').getAttribute('data-list-id');
      dataCard['list_id'] = parseInt(newList_id)

      // recupération de la carte qui a été drop
      const cardDropped = document.querySelector(`[data-card-id = "${dataCard.id}"]`);
      cardDropped.setAttribute('data-card-list_id', dataCard.list_id)

      // insertion de la carte drop dans la liste d'arrivée
      if (event.target.closest('.box')) {
        event.target.closest('.panel-block').insertBefore(cardDropped, event.target.closest('.box').nextSibling)
      }
      else {
        event.target.closest('.panel-block').prepend(cardDropped)
      }


      // récupération de toutes les carte de la liste d'arrivée , et changement de leur position via l'index puis fetch a la bdd les changements
      // a factoriser avec le code suivant
      document.querySelectorAll(`[data-list-id = '${dataCard.list_id}'] .box`).forEach(async (element, index) => {
        element.setAttribute('data-card-position', index + 1)
        const body = {};
        body['position'] = index + 1;
        body['list_id'] = dataCard.list_id
        const json = JSON.stringify(body);
        const response = await fetch(communModule.base_url + '/cards/' + element.getAttribute('data-card-id'), {
          headers: { "Content-Type": "application/json" },
          method: 'PATCH',
          body: json
        });

      })

      // récupération de toutes les cartes de la liste de d&part , et changement de toutes leur position via l'index puis fetch à la bdd
      // a factoriser avec le code précédent
      document.querySelectorAll(`[data-list-id = '${previousList}'] .box`).forEach(async (element, index) => {
        element.setAttribute('data-card-position', index + 1)
        const body = {};
        body['position'] = index + 1;
        body['list_id'] = previousList
        const json = JSON.stringify(body);
        const response = await fetch(communModule.base_url + '/cards/' + element.getAttribute('data-card-id'), {
          headers: { "Content-Type": "application/json" },
          method: 'PATCH',
          body: json
        });

      })
    } catch (error) {
      console.error(error);
    }


  }
}

export default dragDropCards;