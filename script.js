const form = document.querySelector('#request-form');
const preview = document.querySelector('#request-preview');
const vehicle = document.querySelector('#vehicle');
const services = Array.from(form.querySelectorAll('input[name="service"]'));
const undecided = document.querySelector('#undecided');
const serviceError = document.querySelector('#service-error');
const message = document.querySelector('#message');
const copyStatus = document.querySelector('#copy-status');

function updateSelection(checkbox) {
  if (checkbox.checked) {
    if (checkbox === undecided) {
      services.filter((service) => service !== undecided).forEach((service) => {
        service.checked = false;
      });
    } else {
      undecided.checked = false;
    }
    serviceError.hidden = true;
  }
}

services.forEach((service) => {
  service.addEventListener('change', () => updateSelection(service));
});

vehicle.addEventListener('input', () => vehicle.setCustomValidity(''));

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    const service = document.getElementById(link.dataset.service);
    preview.hidden = true;
    form.hidden = false;
    service.checked = true;
    updateSelection(service);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const model = vehicle.value.trim();
  if (!model) {
    vehicle.setCustomValidity('Укажите марку и модель автомобиля.');
    vehicle.reportValidity();
    return;
  }

  const selected = services.filter((service) => service.checked);
  if (!selected.length) {
    serviceError.hidden = false;
    services[0].focus();
    return;
  }

  const scope = undecided.checked
    ? 'Подскажите, какие работы стоит сделать перед продажей.'
    : 'Интересуют услуги: ' + selected.map((service) => service.value).join(', ') + '.';
  message.value = 'Здравствуйте! Хочу подготовить к продаже ' + model + '.\n' + scope +
    '\nПодскажите, пожалуйста, как согласовать стоимость и сроки.';
  copyStatus.textContent = '';
  form.hidden = true;
  preview.hidden = false;
  document.querySelector('#preview-title').focus({ preventScroll: true });
});

document.querySelector('#edit').addEventListener('click', () => {
  preview.hidden = true;
  form.hidden = false;
  vehicle.focus();
});

document.querySelector('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    copyStatus.textContent = 'Текст скопирован.';
  } catch {
    message.focus();
    message.select();
    copyStatus.textContent = 'Текст выделен. Скопируйте его через меню устройства.';
  }
});
