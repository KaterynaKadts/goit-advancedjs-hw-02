
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// console.log('test');

let myDate = '';
let intervalId = null;
const btn = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

 
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    const current = new Date();
    if (selectedDates[0] > current) {
      myDate = selectedDates[0];
      btn.disabled = false;
    } else {
      iziToast.show({
        title: 'Please choose a date in the future',
        position: 'topRight',
        color: 'red',
      });
    }
  },
};

flatpickr('#datetime-picker', options);

if (myDate === '') {
  btn.disabled = true;
} else {
  btn.disabled = false;
}

btn.addEventListener('click', () => {
  if (intervalId) return; 
  if (!myDate) return;

  btn.disabled = true;
  if (dateInput) dateInput.disabled = true; 

  intervalId = setInterval(() => {
    const now = new Date();
    const delta = myDate - now;
    const time = convertMs(delta);
    const dataDays = document.querySelector('[data-days]');
    const datahours = document.querySelector('[data-hours]');
    const dataminutes = document.querySelector('[data-minutes]');
    const dataseconds = document.querySelector('[data-seconds]');

    if (delta <= 0) {
      if (dataDays) dataDays.textContent = addLeadingZero(0);
      if (datahours) datahours.textContent = addLeadingZero(0);
      if (dataminutes) dataminutes.textContent = addLeadingZero(0);
      if (dataseconds) dataseconds.textContent = addLeadingZero(0);

      clearInterval(intervalId);
      intervalId = null;
      if (dateInput) dateInput.disabled = false;
      return;
    }

    if (dataDays) dataDays.textContent = addLeadingZero(time.days);
    if (datahours) datahours.textContent = addLeadingZero(time.hours);
    if (dataminutes) dataminutes.textContent = addLeadingZero(time.minutes);
    if (dataseconds) dataseconds.textContent = addLeadingZero(time.seconds);
  }, 1000);
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}