const classes = ['tags-input'];

// eslint-disable-next-line max-statements
function settings(el) {
  const model = el.dataset.model;
  const method = el.dataset.method;
  const prefix = `${model}_${method}`;
  const isRelation = el.dataset.relation === 'true';
  const collection = el.dataset.collection ? JSON.parse(el.dataset.collection) : null;

  const parsedCollection = collection && collection.map((item) => {
    // eslint-disable-next-line no-unused-vars
    const { id, ...rest } = item;

    return { ...rest, value: item.id, selected: !!item.selected };
  });

  function fillHiddenInput(values) {
    const hiddenInput = document.querySelector(`#${prefix}`);
    hiddenInput.value = values.map(val => val.value).join();
  }

  const events = {
    afterChange: (newVal) => {
      if (isRelation) {
        const selectedItemsContainer = document.querySelector(`#${prefix}_selected_values`);
        const itemName = `${model}[${method}][]`;
        selectedItemsContainer.innerHTML = '';

        newVal.forEach((data) => {
          const itemId = `${prefix}_${data.value}`;
          if (document.querySelectorAll(`#${itemId}`).length > 0) {
            return;
          }

          const hiddenInput = document.createElement('input');
          hiddenInput.id = itemId;
          hiddenInput.name = itemName;
          hiddenInput.value = data.value;
          hiddenInput.type = 'hidden';
          hiddenInput.textContent = data.text;

          selectedItemsContainer.appendChild(hiddenInput);
        });
      } else {
        fillHiddenInput(newVal);
      }
    },
  };

  if (!isRelation) {
    events.addable = (value) => value;
  }

  return {
    data: parsedCollection,
    events,
  };
}

function init(el) {
  el.multiple = true;
}

export default {
  settings,
  classes,
  init,
};
