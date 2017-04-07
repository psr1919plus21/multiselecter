import Component from './Component';

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
    this.settings = this.settings || {};

    this.el.style.display = 'none';
    this.multiple = this.el.getAttribute('multiple') !== null;
    this.el.items =  this._getCleanOptions();
    this.settings.allSelectedPlaceholder = this.settings.allSelectedPlaceholder || 'All selected';
    this.settings.selectedSeparator = this.settings.selectedSeparator || 'of';

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
    this.msItems = this.msDropDown.querySelectorAll('.ms-dropdown__item');

    this.msTitleText.appendChild(msTitleTextNode);
    this.msSelector.appendChild(this.msTitle);
    this.msSelector.appendChild(this.msDropDown);

    // Settings handlers.
    this._setCustomTitleIcon.call(this);
    this._setDropdownNoFlow.call(this);
    this._multipleSelectPresets.call(this);
    this._closeDropdownByArea.call(this);
    this._setDropdownUp.call(this);

    this.el.parentNode.insertBefore(this.msSelector, this.el);

    // Events.
    this.msTitle.addEventListener('click', this._toggleSelector.bind(this));

    this.msItems.forEach((item) => {
      item.addEventListener('click', this._selectItem.bind(this));
    });

  }

  getValue() {
    let result = [];
    let options = this.el && this.el.options;
    let opt;
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];

      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }

  // Maybe later this func will be public for programmatically toggle particular select.
  _toggleSelector() {
    let customTitleIcon = this.msTitle.classList.contains('ms-title_custom-icon');
    let selectOpen = !this.msSelector.classList.contains('ms-wrapper_active');

    if (customTitleIcon && selectOpen) {
      this.customIconBlock.style.backgroundImage = `url(${this.settings.titleIconOpen})`;
    } else if (customTitleIcon && !selectOpen) {
      setTimeout(() => {
        this.customIconBlock.style.backgroundImage = `url(${this.settings.titleIconClose})`;
      }, 300);
    }
    this.msSelector.classList.toggle('ms-wrapper_active');
  }

  // Maybe later this func will be public for programmatically selection particular items.
  _selectItem(e) {
    let dataValue = e.target.getAttribute('data-value');
    let dataTitle = e.target.innerHTML;

    if (this.multiple) {
      e.target.classList.toggle('ms-dropdown__item_active');

      let selectedItems = Array.from(this.msDropDown.querySelectorAll('.ms-dropdown__item_active'));
      let selectedItemsLength = selectedItems.length;
      let allItemsLength = this.el.items.length;
      this._clearNativeMultipleOptions();

      selectedItems.forEach((item) => {
        let selectedValue = item.getAttribute('data-value');
        this._setNativeMultipleOptions(selectedValue);
      });

      if (!selectedItemsLength) {
        this.msTitleText.textContent = this.ui.msPlaceholder[0].text
      }  else if (selectedItemsLength === 1) {
        this.msTitleText.textContent = selectedItems[0].innerHTML;
      } else if (selectedItemsLength < allItemsLength) {
         this.msTitleText.textContent = `${selectedItemsLength} ${this.settings.selectedSeparator} ${allItemsLength}`;
      } else {
        this.msTitleText.textContent = this.settings.allSelectedPlaceholder;
      }

    } else {
      this._toggleSelector.call(this);
      setTimeout(() => {
        this.msTitleText.textContent = dataTitle;
        this._clearSelectedOptions();
        e.target.classList.add('ms-dropdown__item_active');
        this.el.value = dataValue;
      }, 300);
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

  _setDropdownUp() {
    let {settings} = this;
    if (settings.dropdownUp) {
      this.msDropDown.classList.add('ms-dropdown_up');
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

  _multipleSelectPresets() {
    if (this.multiple) {
      this.settings.keepOpenByAreaClick = true;
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

  _clearNativeMultipleOptions() {
    for (let i = 0; i < this.el.options.length; i++) {
      let currentNativeOption = this.el.options[i];
      currentNativeOption.selected = false;
    }
  }

  _setNativeMultipleOptions(_selectedValue) {
    for (let i = 0; i < this.el.options.length; i++) {
      let currentNativeOption = this.el.options[i];
      if (_selectedValue === currentNativeOption.value) {
        currentNativeOption.selected = true;
      }
    }
  }

  _getCleanOptions() {
    return Array.from(this.el.options).filter((item) => {
      return !!item.value;
    });
  }

  _clearSelectedOptions() {
    this.msItems.forEach((option) => {
      option.classList.remove('ms-dropdown__item_active');
    });
  }

}





















