import Component from './Component';

require('../../scss/main.scss');
require('../../scss/MultiSelector.scss');

export default class MultiSelector extends Component {

  preInitialize() {
    this.ui = {
      msPlaceholder: 'option[value=""]',
      msOption: 'option:not([value=""])',
      msOptgroup: 'optgroup'
    }
  }

  afterInitialize() {
    let that = this;
    let msTitle;
    let msPlaceholder;
    let msTitleTextNode;
    let msDropDown;
    let msItems;

    this.el.style.display = 'none';

    // MultiSelector wrapper.
    this.msSelector = document.createElement('div');
    this.msSelector.classList.add('ms-wrapper');

    //MultiSelector title
    this.msTitle = document.createElement('div');
    this.msTitle.classList.add('ms-title');
    this.msTitleText = document.createElement('div');
    this.msTitleText.classList.add('ms-title__text');
    this.msTitle.appendChild(this.msTitleText);


    // MultiSelector placeholder.
    if (this.ui.msPlaceholder.length) {
      msTitleTextNode = document.createTextNode(this.ui.msPlaceholder[0].text);
    } else if (this.ui.msOption.length) {
      msTitleTextNode = document.createTextNode(this.ui.msOption[0].text);
    }

    // Multiselector dropdown.
    this.msDropDown = document.createElement('ul');
    this.msDropDown.classList.add('ms-dropdown');

    this.ui.msOption.forEach((option) => {
      let msItem = document.createElement('li');
      msItem.classList.add('ms-dropdown__item');
      let optionTextNode = document.createTextNode(option.innerHTML.trim());
      let optionValue = option.getAttribute('value');
      msItem.appendChild(optionTextNode);
      msItem.setAttribute('data-value', optionValue);
      this.msDropDown.appendChild(msItem);
    });
    msItems = this.msDropDown.querySelectorAll('.ms-dropdown__item');

    this.msTitleText.appendChild(msTitleTextNode);
    this.msSelector.appendChild(this.msTitle);
    this.msSelector.appendChild(this.msDropDown);


    // Settings handlers.
    this._setCustomTitleIcon.call(this);
    this._setDropdownNoFlow.call(this);
    this._closeDropdownByArea.call(this);

    this.el.parentNode.insertBefore(this.msSelector, this.el);


    // Events.
    this.msTitle.addEventListener('click', toggleSelector.bind(this));
    msItems.forEach((item) => {
      item.addEventListener('click', selectItem.bind(this));
    });

    function toggleSelector() {
      let self = this;
      let customTitleIcon = that.msTitle.classList.contains('ms-title_custom-icon');
      let selectOpen = !self.msSelector.classList.contains('ms-wrapper_active');

      if (customTitleIcon && selectOpen) {
        that.customIconBlock.style.backgroundImage = `url(${that.settings.titleIconOpen})`;
      } else if (customTitleIcon && !selectOpen) {
        that.customIconBlock.style.backgroundImage = `url(${that.settings.titleIconClose})`;
      }
      self.msSelector.classList.toggle('ms-wrapper_active');
    }

    function selectItem(e) {
      let dataValue = e.target.getAttribute('data-value');
      let dataTitle = e.target.innerHTML;

      toggleSelector.call(this);

      setTimeout(() => {
        that.msTitleText.textContent = dataTitle;
        clearSelectedOptions();
        e.target.classList.add('ms-dropdown__item_active');
        that.el.value = dataValue;
      }, 300);

    }


    function clearSelectedOptions() {
      msItems.forEach((option) => {
        option.classList.remove('ms-dropdown__item_active');
      });
    }
  }

  _dropDownClose() {
    this.msSelector.classList.remove('ms-wrapper_active');
    let customTitleIcon = this.msTitle.classList.contains('ms-title_custom-icon');
    if (customTitleIcon) {
      this.customIconBlock.style.backgroundImage = `url(${this.settings.titleIconClose})`;
    }
  }

  _setCustomTitleIcon() {
    let {settings} = this;
    if (settings.titleIconClose && settings.titleIconOpen) {
      this.msTitle.classList.add('ms-title_custom-icon');
      this.customIconBlock = document.createElement('div');
      this.customIconBlock.classList.add('ms-title__icon');
      this.customIconBlock.style.backgroundImage = `url(${this.settings.titleIconClose})`;
      this.msTitle.appendChild(this.customIconBlock);
    }
  }

  _setDropdownNoFlow() {
    let {settings} = this;
    if (settings.dropdownNoFlow) {
      this.msDropDown.classList.add('ms-dropdown_noflow');
    }
  }

  _closeDropdownByArea() {
    let self = this;
    let {settings} = this;
    if (!settings.keepOpenByAreaClick) {
      let body = document.querySelector('body');
    body.addEventListener('click', (e) => {
      let isSelector = self._hasParentClass(e.target, 'ms-wrapper');
      if (!isSelector) {
        self._dropDownClose.call(self);
      }
    });
    }
  }

  _hasParentClass(el, classname) {
    let parent = el.parentNode;
    let parentHasClass = false;

    while(parent) {
      if (parent.classList && parent.classList.contains(classname)) {
        parentHasClass = true;
        break;
      }
      parent = parent.parentNode;
    }

    return parentHasClass;
  }

}





















