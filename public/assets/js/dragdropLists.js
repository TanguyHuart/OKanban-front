import communModule from "./commun.js";
import dragDropCards from "./dragdropCards.js";

const dragDropLists = {

  dragStartHandler: async (event) => {

    document.querySelectorAll('.box').forEach(element => element.removeEventListener('dragstart', dragDropCards.dragstartHandler))

    document.querySelectorAll('.panel').forEach(element => {
      element.addEventListener('dragenter', dragDropLists.dragEnterHandler)
      element.addEventListener('dragover', dragDropLists.dragOverHandler)
      element.addEventListener('dragleave', dragDropLists.dragLeaveHandler)
      element.addEventListener('dragend', dragDropLists.dragEndHandler)
      element.addEventListener('drop', dragDropLists.dropHandler)
    })

    const dataList = {
      id: parseInt(event.target.getAttribute('data-list-id')),
      position: parseInt(event.target.getAttribute('data-list-position')),

    }
    const json = JSON.stringify(dataList)
    event.dataTransfer.setData('listData', json)


  },


  dragEnterHandler: (event) => {


    event.preventDefault();
    event.target.closest('.panel').style["border-right"] = '5px solid black'
  },


  dragOverHandler: (event) => {


    event.preventDefault();
    event.target.closest('.panel').style["border-right"] = '5px solid black'
  },


  dragLeaveHandler: (event) => {


    event.preventDefault();
    event.target.closest('.panel').style["border-right"] = ''
  },

  dragEndHandler: (event) => {

    event.target.closest('.panel').style["border-right"] = ''

    document.querySelectorAll('.box').forEach(element => element.addEventListener('dragstart', dragDropCards.dragstartHandler))

    document.querySelectorAll('.panel').forEach(element => {
      element.removeEventListener('dragenter', dragDropLists.dragEnterHandler)
      element.removeEventListener('dragover', dragDropLists.dragOverHandler)
      element.removeEventListener('dragleave', dragDropLists.dragLeaveHandler)
      element.removeEventListener('dragend', dragDropLists.dragEndHandler)
      element.removeEventListener('drop', dragDropLists.dropHandler)

    })
  },


  dropHandler: async (event) => {

    event.target.closest('.panel').style["border-right"] = ''

    document.querySelectorAll('.box').forEach(element => element.addEventListener('dragstart', dragDropCards.dragstartHandler))
    document.querySelectorAll('.panel').forEach(element => {
      element.removeEventListener('dragenter', dragDropLists.dragEnterHandler)
      element.removeEventListener('dragover', dragDropLists.dragOverHandler)
      element.removeEventListener('dragleave', dragDropLists.dragLeaveHandler)
      element.removeEventListener('dragend', dragDropLists.dragEndHandler)
      element.removeEventListener('drop', dragDropLists.dropHandler)

    })


    const dataList = JSON.parse(event.dataTransfer.getData('listData'));
    const dropedList = document.querySelector(`[data-list-id = "${dataList.id}"]`)

    if (event.target.closest('.panel')) {
      event.target.closest('.card-lists').insertBefore(dropedList, event.target.closest('.panel').nextSibling)
    }

    try {
      const lists = document.querySelectorAll('.panel')
      lists.forEach(async (list, index) => {
        list.setAttribute('data-list-position', index + 1)
        const body = {};
        body['position'] = index + 1;
        const json = JSON.stringify(body);
        const response = await fetch(communModule.base_url + '/lists/' + list.getAttribute('data-list-id'), {
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
export default dragDropLists;