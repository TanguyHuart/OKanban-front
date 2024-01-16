import communModule from "./commun.js";


const tagModule = {




  makeTagInDOM: (tag) => {
    console.log(tag);
    const tagDOM = document.createElement('span');
    tagDOM.classList.add('tag')
    tagDOM.dataset.tagId = tag.id
    tagDOM.textContent = tag.name
    tagDOM.style.backgroundColor = tag.color
    const cardDOM = document.querySelector(`.box[data-card-id = "${tag.card_tag.card_id}"]`)
    cardDOM.querySelector('.tags').appendChild(tagDOM)
  },

  showAssociateTagForm: async (event) => {
    const cardDOM = event.target.closest('.box')
    const cardId = cardDOM.getAttribute('data-card-id')

    const modal = document.getElementById('addTagToCardModal')
    modal.querySelector('input[name = "card_id"]').value = cardId

    const select = modal.querySelector('select[name="tag_id"]')

    try {
      const response = await fetch(communModule.base_url + '/tags')
      const json = await response.json();

      if (!response.ok) throw json
      for (const tag of json) {
        const option = document.createElement('option')
        option.textContent = tag.name
        option.value = tag.id
        select.appendChild(option)
      }

    } catch (error) {
      console.log(error);
    }
    modal.classList.add('is-active');


  },

  associateTagToCard: async (event) => {

    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(event.target);
    const object = {}
    formData.forEach((key, value) => object[value] = key);
    console.log(object);
    const jsonObject = JSON.stringify(object)

    try {
      console.log(formData.get('card_id'));
      const response = await fetch(`${communModule.base_url}/cards/${formData.get('card_id')}/tag`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: jsonObject

      });
      const json = await response.json()
      const newTag = json.tags.find(tag => tag.id === Number(formData.get('tag_id')))
      tagModule.makeTagInDOM(newTag)

      return communModule.hideModals();
    } catch (error) {
      console.error(error);
    }
  }

}

export default tagModule;