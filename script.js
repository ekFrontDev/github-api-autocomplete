//глобальные переменные
const wrapper = document.querySelector(".wrapper-form");
const form = document.querySelector(".form");
const input = document.querySelector("input");
const wrapperAutocomplete = document.querySelector(".autocomplete-box");
const autocompleteCard = document.querySelector("li");
const cardRepo = document.querySelectorAll(".card-repo");

//функции
//создает элемент разметки для автокомплита
function createElAutocomplete(nameRepository, obj) {
		const htmlElement = document.createElement("li");//создаем ли
		htmlElement.classList.add("autocomplete-card");//присваиваем класс для ли
		htmlElement.innerHTML = `${nameRepository}`;//добавляем содержимое внутрь ли
		wrapperAutocomplete.append(htmlElement);//добавляем ли в конец дива
		
		//создаем карточку репозитория
		let ownerName = obj.owner;//объект owner с логином
		let stars = obj.stargazers_count;//количество звезд
		const wrapperCardRepository = document.createElement("div");
		wrapperCardRepository.classList.add("card-repo", `${nameRepository}`);
		const innerStyleWrapperCard = wrapperCardRepository.style;
		const cardRepository = document.createElement("div");
		cardRepository.classList.add("cardID");
		const innerStyleCardRepository = cardRepository.style;
		cardRepository.innerHTML = `Name: ${nameRepository}<br>Owner: ${ownerName.login}</br>Stars: ${stars}`;
		wrapperCardRepository.append(cardRepository);
		wrapper.append(wrapperCardRepository);
		eventListener(htmlElement);
		eventListenerCardRepo(wrapperCardRepository);
}

//функция для удаления дочерних элементов
function removeElAutocomplete() {
	while (wrapperAutocomplete.firstChild) {
		wrapperAutocomplete.removeChild(wrapperAutocomplete.firstChild);
	}
}

//функция создает запрос на сервер с введенным значением инпут
async function getInfoApi(name) {
	let promise = await fetch(`https://api.github.com/search/repositories?q=${name}&per_page=5`);
	let json = await promise.json();
	let array = json.items;

	removeElAutocomplete();

	try {
		array.forEach((el) => {
			let newObj = el;
			let ownerName = newObj.owner;//объект owner с логином
			let stars = el.stargazers_count;//количество звезд
			let nameEl = newObj.name;//имя
			if (nameEl.startsWith(name)) {
				createElAutocomplete(el.name, newObj);
			}
			});
	} catch (e) {
		console.log(e.message);
	}
}

//функция, которая записывает введеное в поле значение и делает API запрос
function inputToConsole(value) {
		let user = value.target.value;//записываем введенное значение в переменную
		console.log(user);
		if (user) {
			return getInfoApi(user);
		} else {
			return removeElAutocomplete();
		}
}

//слушатель события для input
input.addEventListener("keyup", inputToConsole);

//функция добавляет слушатель события для карточки репозитория
function eventListenerCardRepo(elem) {
	elem.addEventListener("click", () => {
		return elem.style.display = "none";
	})
};

//функция добавляет слушатель события для li
function eventListener(elem) {
	let className = elem.textContent;
	return elem.addEventListener("click", function() {
		let wrapperCardRepository = document.querySelector(`.${className}`);
		let textContent = wrapperCardRepository.textContent;
		let innerStyleWrapperCard = wrapperCardRepository.style;
		if (wrapperCardRepository.style.display === "block") {
			return wrapperCardRepository.style.display = "none";
		} else {
			return wrapperCardRepository.style.display = "block";
		}
	});
};


