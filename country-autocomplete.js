'use strict';

class CountryAutocomplete {

	constructor(input) {
		if (this.checkInput(input)) {
			this.activeCountry = -1;
			this.input = input;
			this.activeCountry = 
			this.countryList = [];
			this.suggestedCountries = [];
			this.loadCountryList();
			this.createContainer();
			this.createSuggestBox();
			this.bindSearch();
			this.bindKeyPress();
		};
	}

	addClickEvent(item, country) {
		item.addEventListener('click', () => {
			this.selectCountry(country);
		});
	}

	bindKeyPress() {
		this.input.addEventListener('keydown', (e) => {			
			if (e.keyCode === 40) {
				this.activeCountry++;
				if (this.activeCountry === this.suggestedCountries.length) {
					this.activeCountry--;
				};
			} else if (e.keyCode === 38) {
				this.activeCountry--;
				if (this.activeCountry === -1) {
					this.activeCountry++;
				};
			} else if (e.keyCode === 13 && this.activeCountry > -1) {
				this.selectCountry(this.suggestedCountries[this.activeCountry]);
				this.activeCountry = -1;
			} else {
				this.activeCountry = -1;
			};
			this.highlightCountry();
		});
	}

	bindSearch() {
		this.input.addEventListener('input', (e) => {
			this.searchCountries(this.input);
		});
	}

	checkInput(input) {
		if (typeof(input) === 'undefined') {
			console.error('Sorry, but an input element must be specified.');
			return false;
		} else {
			return true;
		};
	}

	createContainer() {
		let container = document.createElement('div');
		container.classList.add('country-autocomplete');
		this.input.parentNode.insertBefore(container, this.input);
		container.appendChild(this.input);
	}

	createSuggestBox() {
		let container = document.querySelector('.country-autocomplete');
		let suggest = document.createElement('div');
		let list = document.createElement('ul');
		suggest.classList.add('country-autocomplete-suggest');
		list.classList.add('country-autocomplete-suggest-list');
		suggest.appendChild(list);
		container.appendChild(suggest);
	}

	highlightCountry() {
		let index = 0;
		let items = document.querySelectorAll('.country-autocomplete-suggest-item');
		[ ...items ].forEach((item) => {
			if (index === this.activeCountry) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			};
			index++;
		});
	}

	loadCountryList() {
		fetch('country-list.json')
		.then((response) => response.json())
		.then((data) => {
			this.countryList = data.countries;
		});
	}

	populateSuggestions() {
		let list = document.querySelector('.country-autocomplete-suggest-list');
		list.innerHTML = '';
		for (let country of this.suggestedCountries) {
			let item = document.createElement('li');
			item.classList.add('country-autocomplete-suggest-item');
			item.textContent = country;
			this.addClickEvent(item, country);
			list.appendChild(item);
		};
	}

	searchCountries(input) {
		this.suggestedCountries = [];
		for (let country of this.countryList) {
			if (input.value.length > 0) {
				let inputValue = input.value.toLowerCase();
				let longname = country.longname.toLowerCase();
				let shortnames = null;
				if (country.shortnames) {
					shortnames = country.shortnames.toLowerCase();
				};
				if ( (longname.includes(inputValue)) || 
					(shortnames && shortnames.includes(inputValue)) ) {
					this.suggestedCountries.push(country.longname);
				};
			};
		};
		this.populateSuggestions();
	}

	selectCountry(country) {
		let input = document.querySelector('.js-country-autocomplete');
		let list = document.querySelector('.country-autocomplete-suggest-list');
		input.value = country;
		list.innerHTML = '';
	}

};