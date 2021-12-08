const main = document.querySelector("main");
const basicArray = [
	{ pic: 0, min: 1 },
	{ pic: 1, min: 1 },
	{ pic: 2, min: 1 },
	{ pic: 3, min: 1 },
	{ pic: 4, min: 1 },
	{ pic: 5, min: 1 },
	{ pic: 6, min: 1 },
	{ pic: 7, min: 1 },
	{ pic: 8, min: 1 },
	{ pic: 9, min: 1 },
];
let exerciceArray = [];

// Get stored exercices array
// fonction anonyme qui se lance une seule fois au chargement de la page
/**
 * Si données dans localStorage.exercices on les charge dans exerciceArray[]
 */
(() => {
	if (localStorage.exercices) {
		exerciceArray = JSON.parse(localStorage.exercices);
	} else {
		exerciceArray = basicArray;
	}
})();

class Exercice {}

const utils = {
	/**
	 * Défini le contenu de la page
	 *
	 * @param   {string}  title    Titre de la page
	 * @param   {string}  content  Contenu de la page
	 * @param   {string}  btn      Bouton de la page
	 *
	 * @return  {void}           Défini le contenu de la page selon ces paramétres
	 */
	pageContent: function (title, content, btn) {
		document.querySelector("h1").innerHTML = title;
		main.innerHTML = content;
		document.querySelector(".btn-container").innerHTML = btn;
	},
	/**
	 * Lors du clic sur les minutes stocke le nombre de minutes dans le tableau exerciceArray
	 *
	 * @return  {void}  Nombre de minutes mis à jour à chaque input, pour chaque exercice, dans exerciceArray[]
	 */
	handleEventMinutes: function () {
		document.querySelectorAll("input[type=number]").forEach((input) => {
			input.addEventListener("input", (e) => {
				exerciceArray.map((exo) => {
					if (exo.pic == e.target.id) {
						exo.min = parseInt(e.target.value);
						this.store();
					}
				});
			});
		});
	},
	/**
	 * Lors du clic sur le fléche, inverse les positions avec l'element précedent du tableau exerciceArray puis relance page.lobby() pour le visuel
	 *
	 * @return  {void}  Mis a jour de la page de lobby en fonction des nouvelles valeur dans exerciceArray[]
	 */
	handleEventArrow: function () {
		document.querySelectorAll(".arrow").forEach((arrow) => {
			arrow.addEventListener("click", (e) => {
				let position = 0;
				exerciceArray.map((exo) => {
					if (exo.pic == e.target.dataset.pic && position !== 0) {
						[exerciceArray[position], exerciceArray[position - 1]] = [
							exerciceArray[position - 1],
							exerciceArray[position],
						];
						page.lobby();
						this.store();
					} else {
						position++;
					}
				});
			});
		});
	},
	/**
	 * Lors du clic sur la croix, on crée un nouveau tableau sans l'élement qui a été cliqué, puis on attribue la valeur du nouveau tableau à exerciceArray[], puis on relance page.lobby() pour le visuel.
	 *
	 * @return  {void}  Mis a jour de la page de lobby en fonction des nouvelles valeur dans exerciceArray[]
	 */
	deleteItem: function () {
		document.querySelectorAll(".deleteBtn").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				let newArr = [];
				exerciceArray.map((exo) => {
					if (exo.pic != e.target.dataset.pic) {
						newArr.push(exo);
					}
				});
				exerciceArray = newArr;
				page.lobby();
				this.store();
			});
		});
	},
	/**
	 * Réinitialisation du tableau exerciceArray, puis on relance page.lobby() pour le visuel et enregistre
	 *
	 * @return  {void}  [return description]
	 */
	reboot: function () {
		exerciceArray = basicArray;
		page.lobby();
		this.store();
	},

	store: function () {
		localStorage.exercices = JSON.stringify(exerciceArray);
	},
};

/**
 * Gestion des pages
 * @var {object}
 * @type {any}
 */
const page = {
	/**
	 * Gestion de la page lobby
	 *
	 * @return  {void}  Gestion de la page lobby
	 */
	lobby: function () {
		let mapArray = exerciceArray
			.map(
				(exo) => /* html */ `
        <li>
          <div class="card-header">
            <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
            <span>min</span>
          </div>
          <img src="./img/${exo.pic}.png" />
          <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
          <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
        </li>
    
      `
			)
			.join(" ");

		utils.pageContent(
			/* html */ `Paramétrages <i id="reboot" class="fa fa-undo" aria-hidden="true"></i>`,
			/* html */ `<ul>${mapArray}</ul>`,
			/* html */ `<button id="start">Commencer<i class="far fa-play-circle"></i></button>`
		);
		utils.handleEventMinutes();
		utils.handleEventArrow();
		utils.deleteItem();
		reboot.addEventListener("click", () => utils.reboot());
		start.addEventListener("click", () => this.routine());
	},

	routine: function () {},

	finish: function () {
		utils.pageContent(
			"C'est terminé !",
			/* html */ `<button id="start">Recommencer</button>`,
			/* html */ `<button id="reboot" class="btn-reboot">Réinitialiser <i class="fas fat-times-circle"></i></button>`
		);
	},
};
page.lobby();
