var pokemonRepository = (function () {
    var repository = [];
    var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

    //no chnages here
    function add(pokemon) {
      repository.push(pokemon);
    }

    //no changes here
    function getAll() {
      return repository;
    }

//Updated function using JQuery syntax
    function addListItem(pokemon) {
      var $pokemonList = $('.pokemon-list');
      var $listItem = $('<li>');
      var $button = $('<button class="list-button">' + pokemon.name + '</button>');
      $listItem.append($button);
      $pokemonList.append($listItem);
      $button.on('click', function (event) {
        showDetails(pokemon);
      });
    }

  //no changes here
    function showDetails(item) {
      pokemonRepository.loadDetails(item).then(function () {
        showModal(item);
      });
    }

    //Updated syntax using .ajax similar to fetch
    function loadList() {
      return $.ajax(apiUrl)
        .then(function (json) {
          json.results.forEach(function (item) {
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
            console.log(pokemon);
          });
        })
        .catch(function (e) {
          console.error(e);
        });
    }

    //updated syntax using .ajax
    function loadDetails(item) {
      var url = item.detailsUrl;
      return $.ajax(url)
        .then(function (details) {
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
        })
        .catch(function (e) {
          console.error(e);
        });
    }

    //Updated function using JQuery
    function showModal(item) {
      var $modalContainer = $('#modal-container');
      $modalContainer.empty();
      var modal = $('<div class="modal"></div>');
      var closeButtonElement = $('<button class="modal-close">Close</button>');
      closeButtonElement.on('click', hideModal);
      var nameElement = $('<h1>' + item.name + '</h1>');
      var imageElement = $('<img class="modal-img">');
      imageElement.attr('src', item.imageUrl);
      var heightElement = $('<p>' + 'Height: ' + item.height + 'm' + '</p>');

      modal.append(closeButtonElement);
      modal.append(nameElement);
      modal.append(imageElement);
      modal.append(heightElement);
      $modalContainer.append(modal);

      $modalContainer.addClass('is-visible');
    }

    //JQuery update
    function hideModal() {
      var $modalContainer = $('#modal-container');
      $modalContainer.removeClass('is-visible');
    }

    //Minor JQuery update
    jQuery(window).on('keydown', e => {
      var $modalContainer = $('#modal-container');
      if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
        hideModal();
      }
    });

    /*Regarding this line of code, was not sure why it has to be document query selector otherwise
    the page does not load properly.*/

    var $modalContainer = document.querySelector('#modal-container');
    $modalContainer.addEventListener('click', e => {
      var target = e.target;
      if (target === $modalContainer) {
        hideModal();
      }
    });

    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showModal: showModal,
      hideModal: hideModal
    };
  })();

  pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });
