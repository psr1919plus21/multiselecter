import {expect} from 'chai';
let beautify_html = require('js-beautify').html;
let jsdom = require('jsdom').jsdom;
let MultiSelector = require('../src/app/components/MultiSelector').default;
let plainSelect;
let placeholderSelect;
let multipleSelect;

beforeEach(function() {
  global.document = jsdom();
  _createPlainSelect();
  _createSelectWithPlaceholder();
  _createSelectMultiple();
});

describe('MultiSelector', function() {
  it('shoud exist select in jsdom', function() {
    expect(plainSelect.tagName).to.equal('SELECT');
  });

  it('should hide native element', function() {
    new MultiSelector({
      el: plainSelect
    });
    expect(plainSelect.style.display).to.equal('none');
  });


  it('should have four li items', function() {
    let selectorInstance = new MultiSelector({
      el: plainSelect
    });
    expect(selectorInstance.msItems[0].tagName).to.equal('LI');
    expect(selectorInstance.msItems.length).to.equal(4);
  })

  it('shoud have placeholder', function() {
    let selectorInstance = new MultiSelector({
      el: placeholderSelect
    });
    let placeholder = selectorInstance.ui.msPlaceholder[0].innerHTML;
    expect(placeholder).to.equal('Select your turtle');
  })

  it('shoud change title while select item', function(done) {
    let selectorInstance = new MultiSelector({
      el: placeholderSelect
    });

    selectorInstance.msTitle.click();
    selectorInstance.msItems[0].click();
    setTimeout(() => {
      let title = selectorInstance.msTitleText.innerHTML;
      expect(title).to.equal('Leonardo');
      done();
    }, 300);
  });

  it('shoud change select value', function(done) {
    let selectorInstance = new MultiSelector({
      el: placeholderSelect
    });

    selectorInstance.msTitle.click();
    selectorInstance.msItems[0].click();
    setTimeout(() => {
      let expected = ['leonardo'];
      let actual = selectorInstance.getValue();
      expect(expected).to.deep.equal(actual);
      done();
    }, 300);
  });

  it('shoud select multiple items', function(done) {
    let selectorInstance = new MultiSelector({
      el: multipleSelect
    });
     selectorInstance.msItems[0].click();
     selectorInstance.msItems[1].click();
    setTimeout(() => {
      let expected = ['leonardo', 'donatello'];
      let actual = selectorInstance.getValue();
      expect(expected).to.deep.equal(actual);
      done();
    }, 300);
  })

  it('shoud return empty array on first load', function() {
    let selectorInstance = new MultiSelector({
      el: placeholderSelect
    });
    let expected = [];
    let actual = selectorInstance.getValue();
    expect(expected).to.deep.equal(actual);

  });

  it('shoud have select all button', function() {
    let selectorInstance = new MultiSelector({
      el: multipleSelect,
      settings: {
        selectAll: true
      }
    });
    let selectAllBtn = selectorInstance.msSelectAll;
    let expected = 'LI';
    let actual = selectAllBtn.tagName;
    expect(expected).to.equal(actual);
  })

  it('shoud select all items by button', function() {
    let selectorInstance = new MultiSelector({
      el: multipleSelect,
      settings: {
        selectAll: true
      }
    });
    let selectAllBtn = selectorInstance.msSelectAll;
    selectAllBtn.click();
    let expected = ['leonardo', 'donatello', 'michelangelo', 'raphael'];
    let actual = selectorInstance.getValue();
    expect(expected).to.deep.equal(actual);
  })

  it('shoud add disabled class to select all button.', function() {
    let selectorInstance = new MultiSelector({
      el: multipleSelect,
      settings: {
        selectAll: true
      }
    });
    let selectAllBtn = selectorInstance.msSelectAll;
    selectAllBtn.click();
    let expected = true;
    let actual = selectAllBtn.classList.contains('ms-dropdown__select-all_active');
    expect(expected).to.equal(actual);
  })

  it('shoud remove disabled class from select all button after deselect one of items.', function() {
    let selectorInstance = new MultiSelector({
      el: multipleSelect,
      settings: {
        selectAll: true
      }
    });
    let selectAllBtn = selectorInstance.msSelectAll;
    let firstOption = selectorInstance.msItems[0];
    selectAllBtn.click();
    firstOption.click();
    let expected = false;
    let actual = selectAllBtn.classList.contains('ms-dropdown__select-all_active');
    expect(expected).to.equal(actual);
  })

  it('shoud set disabled class on select all button after select all items.', function(done) {
    let selectorInstance = new MultiSelector({
      el: multipleSelect,
      settings: {
        selectAll: true
      }
    });
    let selectAllBtn = selectorInstance.msSelectAll;
    let firstOption = selectorInstance.msItems[0];
    selectAllBtn.click();
    firstOption.click();
    setTimeout(function() {
      firstOption.click();
      setTimeout(function() {
        let expected = true;
        let actual = selectAllBtn.classList.contains('ms-dropdown__select-all_active');
        expect(expected).to.equal(actual);
        done();
      }, 300);
    }, 600);
  })


});

function _createPlainSelect() {
  let selectData = ['Leonardo', 'Donatello', 'Michelangelo', 'Raphael'];
  let selectWrapper = document.createElement('div');
  plainSelect = document.createElement('select');

  selectData.forEach((item) => {
    let normalizedItem = item.trim().toLowerCase();
    let option = document.createElement('option');
    let optionText = document.createTextNode(item);
    option.setAttribute('value', normalizedItem);
    option.appendChild(optionText);
    plainSelect.appendChild(option);
  })

  selectWrapper.appendChild(plainSelect);
}

function _createSelectWithPlaceholder() {
  let placeholderText = 'Select your turtle';
  let selectData = ['Leonardo', 'Donatello', 'Michelangelo', 'Raphael'];
  let selectWrapper = document.createElement('div');
  placeholderSelect = document.createElement('select');

  let option = document.createElement('option');
  let optionText = document.createTextNode(placeholderText);
  option.setAttribute('value', '');
  option.appendChild(optionText);
  placeholderSelect.appendChild(option);

  selectData.forEach((item) => {
    let normalizedItem = item.trim().toLowerCase();
    let option = document.createElement('option');
    let optionText = document.createTextNode(item);
    option.setAttribute('value', normalizedItem);
    option.appendChild(optionText);
    placeholderSelect.appendChild(option);
  })

  selectWrapper.appendChild(placeholderSelect);
}

function _createSelectMultiple() {
  let placeholderText = 'Select your turtle';
  let selectData = ['Leonardo', 'Donatello', 'Michelangelo', 'Raphael'];
  let selectWrapper = document.createElement('div');
  multipleSelect = document.createElement('select');
  multipleSelect.setAttribute('multiple', true);


  let option = document.createElement('option');
  let optionText = document.createTextNode(placeholderText);
  option.setAttribute('value', '');
  option.appendChild(optionText);
  multipleSelect.appendChild(option);

  selectData.forEach((item) => {
    let normalizedItem = item.trim().toLowerCase();
    let option = document.createElement('option');
    let optionText = document.createTextNode(item);
    option.setAttribute('value', normalizedItem);
    option.appendChild(optionText);
    multipleSelect.appendChild(option);
  })

  selectWrapper.appendChild(multipleSelect);
}







