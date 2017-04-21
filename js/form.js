'use strict';

var form = document.body.querySelector('.notice__form');
var typeOfLodge = form.querySelector('#type');
var price = form.querySelector('#price');
var roomNumber = form.querySelector('#room_number');
var capacity = form.querySelector('#capacity');
var timeIn = form.querySelector('#time');
var timeOut = form.querySelector('#timeout');

var TIMES_MAP = {
  'after_12': 'before_12',
  'after_13': 'before_13',
  'after_14': 'before_14'
};
var TYPES_MAP = {
  'flat': 1000,
  'shack': 0,
  'palace': 10000
};
var GUEST_MAP = {
  'rooms_number_1': 'guest_0',
  'rooms_number_2': 'guest_3',
  'rooms_number_100': 'guest_3'
};

timeIn.addEventListener('change', function (evt) {
  timeOut.value = TIMES_MAP[timeIn.value];
});

typeOfLodge.addEventListener('change', function () {
  price.value = TYPES_MAP[typeOfLodge.value];
});

roomNumber.addEventListener('change', function () {
  capacity.value = GUEST_MAP[roomNumber.value];
});

form.addEventListener('invalid', function (evt) {
  evt.target.classList.add('error');
}, true);

form.addEventListener('change', function (evt) {
  if (evt.target.classList.contains('error')) {
    if (evt.target.validity.valid) {
      evt.target.classList.remove('error');
    }
  }
}, true);
