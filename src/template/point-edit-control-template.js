import { EditType } from '../const.js';

const ButtonLabel = {
  [EditType.EDITING]: 'Delete',
  [EditType.CREATING]: 'Cancel'
};

function createDeleteButtonTemplate({ type, isDisabled, isDeleting }) {
  return `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
    ${!isDeleting ? ButtonLabel[type] : 'Deleting...'}
  </button>`;
}

function createRollupButtonTemplate() {
  return `<button class="event__rollup-btn"
  type="button">
  <span class="visually-hidden">Open event</span>
  </button>`;
}

function createPointEditControlsTemplate({ typeButton: type, isDisabled, isSaving, isDeleting }) {
  return `
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
    ${isSaving ? 'Saving...' : 'Save'}
    </button>
    ${createDeleteButtonTemplate({ type, isDisabled, isDeleting })}
    ${(type !== EditType.CREATING) ? createRollupButtonTemplate() : ''}
    `;
}

export { createPointEditControlsTemplate };
