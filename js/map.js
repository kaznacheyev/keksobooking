'use strict';

var ads = [];
var numberOfAds = 8;
var tokyoMap = document.body.querySelector('.tokyo__pin-map');
var lodgeTemplate = document.body.querySelector('#lodge-template').content;

var AVATAR = ['01', '02', '03', '04', '05', '06', '07', '08'];
var LODGE_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var LODGE_TYPES = ['flat', 'house', 'bungalo'];
var CHECKS = ['12:00', '13:00', '14:00'];
var LODGE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var MAX_PRICE = 1000000;
var MIN_PRICE = 1000;
var MAX_ROOMS = 5;
var MIN_ROOMS = 1;
var MAX_GUESTS = 10;
var MIN_GUESTS = 1;
var MAX_LOCATION_X = 900;
var MIN_LOCATION_X = 300;
var MAX_LOCATION_Y = 500;
var MIN_LOCATION_Y = 100;
var ESC_KEY_CODE = 27;
var ENTER_KEY_CODE = 13;

var getRandomElementFromArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomNumber = function (minNumber, maxNumber) {
  return Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
};

var getRandomLocation = function () {
  return {
    x: getRandomNumber(MIN_LOCATION_X, MAX_LOCATION_X),
    y: getRandomNumber(MIN_LOCATION_Y, MAX_LOCATION_Y)
  };
};

var getRandomArray = function (array) {
  var newArray = [];
  var arrayLength = array.length;
  var newArrayLength = getRandomNumber(1, arrayLength);
  for (var i = 0; i < newArrayLength; i++) {
    newArray[i] = array[i];
  }
  return newArray;
};

var getWithoutRepeat = function (array) {
  var index = getRandomNumber(0, array.length - 1);
  var randomResult = array[index];
  array.splice(index, 1);
  return randomResult;
};

var createAd = function () {
  var ad = {};
  ad.author = {};
  ad.author.avatar = 'img/avatars/user' + getWithoutRepeat(AVATAR) + '.png';
  ad.location = getRandomLocation();
  ad.offer = {};
  ad.offer.title = getWithoutRepeat(LODGE_TITLES);
  ad.offer.address = ad.location.x + ', ' + ad.location.y;
  ad.offer.price = getRandomNumber(MIN_PRICE, MAX_PRICE);
  ad.offer.type = getRandomElementFromArray(LODGE_TYPES);
  ad.offer.rooms = getRandomNumber(MIN_ROOMS, MAX_ROOMS);
  ad.offer.guests = getRandomNumber(MIN_GUESTS, MAX_GUESTS);
  ad.offer.checkin = getRandomElementFromArray(CHECKS);
  ad.offer.checkout = getRandomElementFromArray(CHECKS);
  ad.offer.features = getRandomArray(LODGE_FEATURES);
  ad.offer.description = '';
  ad.offer.photos = [];
  return ad;
};

var createAllAds = function (count) {
  for (var i = 0; i < count; i++) {
    ads[i] = createAd();
  }
};

createAllAds(numberOfAds);

var createLabel = function (array) {
  var label = document.createElement('div');
  var labelImg = document.createElement('img');
  var imgWidth = 40;
  var imgHeight = 40;
  var labelStyleLeft = array.location.x + (imgWidth / 2);
  var labelStyleTop = array.location.y + imgHeight;

  label.classList.add('pin');
  label.setAttribute('style', 'left: ' + labelStyleLeft + 'px; top: ' + labelStyleTop + 'px;');

  labelImg.classList.add('rounded');
  labelImg.setAttribute('src', array.author.avatar);
  labelImg.setAttribute('width', imgWidth);
  labelImg.setAttribute('height', imgHeight);
  labelImg.setAttribute('tabindex', '0');
  label.appendChild(labelImg);
  return label;
};

var createFragments = function (array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createLabel(array[i]));
  }
  tokyoMap.appendChild(fragment);
};

createFragments(ads);

var translateLodgeToRus = function (type) {
  if (type === 'flat') {
    return 'квартира';
  } else if (type === 'house') {
    return 'дом';
  } else {
    return 'бунгало';
  }
};

var createSpan = function (lodgeFeatures) {
  var newSpan = document.createElement('span');
  newSpan.classList.add('feature__image', 'feature__image--' + lodgeFeatures);
  return newSpan;
};

var renderLodgeTemplate = function (array) {
  var lodgeElement = lodgeTemplate.cloneNode(true);
  var offer = array.offer;

  lodgeElement.querySelector('.lodge__title').textContent = offer.title;
  lodgeElement.querySelector('.lodge__address').textContent = offer.address;
  lodgeElement.querySelector('.lodge__price').textContent = offer.price + ' ₽' + '/ночь';
  lodgeElement.querySelector('.lodge__type').textContent = translateLodgeToRus(offer.type);
  lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + offer.guests + ' гостей в ' + offer.rooms + ' комнатах';
  lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + offer.checkin + ', выезд после ' + offer.checkout;
  for (var i = 0; i < offer.features.length; i++) {
    lodgeElement.querySelector('.lodge__features').appendChild(createSpan(offer.features[i]));
  }
  lodgeElement.querySelector('.lodge__description').textContent = offer.description;
  return lodgeElement;
};

var generateLodgeTemplate = function (advert) {
  var dialogPanel = document.querySelector('.dialog__panel');
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderLodgeTemplate(advert));
  dialogPanel.parentNode.replaceChild(fragment, dialogPanel);

  var avatar = document.querySelector('.dialog__title img');
  avatar.setAttribute('src', advert.author.avatar);
};

var pins = document.querySelectorAll('.pin');
var dialog = document.querySelector('.dialog');
var dialogClose = dialog.querySelector('.dialog__close');

var onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEY_CODE) {
    closePopupDialog(dialog);
  }
};

var closePopupDialog = function (block) {
  block.style.display = 'none';
  document.removeEventListener('keydown', onEscPress);
};

closePopupDialog(dialog);

var onEnterPress = function (evt) {
  return evt.keyCode === ENTER_KEY_CODE;
};

var deleteClass = function (array, className) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].classList.contains(className)) {
      array[i].classList.remove(className);
    }
  }
};

var openPopupDialog = function (evt) {
  var clickedPinAvatar = evt.target;
  var clickedPinWrap = clickedPinAvatar.parentNode;

  if (clickedPinAvatar.classList.contains('rounded') && !(clickedPinWrap.classList.contains('pin__main'))) {
    var imageSrc = clickedPinAvatar.getAttribute('src');

    for (var i = 0; i < ads.length; i++) {
      if (ads[i].author.avatar === imageSrc) {
        var index = i;
      }
    }
    generateLodgeTemplate(ads[index]);

    document.addEventListener('keydown', onEscPress);
    deleteClass(pins, 'pin--active');
    clickedPinWrap.classList.add('pin--active');
    dialog.style.display = 'block';
  }
};

tokyoMap.addEventListener('click', function (evt) {
  openPopupDialog(evt);
});

tokyoMap.addEventListener('keydown', function (evt) {
  if (onEnterPress(evt)) {
    openPopupDialog(evt);
  }
});

dialogClose.addEventListener('click', function () {
  closePopupDialog(dialog);
  deleteClass(pins, 'pin--active');
});

dialogClose.addEventListener('keydown', function (evt) {
  if (onEnterPress(evt)) {
    closePopupDialog(dialog);
    deleteClass(pins, 'pin--active');
  }
});
