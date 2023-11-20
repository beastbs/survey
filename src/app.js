import { isValid, createModal } from "./utils";
import { Question } from "./question";
import { getAuthForm, authWithEmailAndPassword } from "./auth";
import "./styles.css";

const form = document.getElementById("form");
const modalButton = document.getElementById("modal-button")
const questionInput = form.querySelector("#question-input");
const submitFormButton = form.querySelector("#submit");

window.addEventListener("load", Question.renderList());
form.addEventListener("submit", submitFormHandler);
modalButton.addEventListener("click", openModalHandler);
questionInput.addEventListener("input", changeInputHandler);

function changeInputHandler(){
	submitFormButton.disabled = !isValid(questionInput.value);
}

function submitFormHandler(event){
	event.preventDefault();

	const inputValue = questionInput.value
	if(isValid(inputValue)){
		const question = {
			text: inputValue.trim(),
			date: new Date().toJSON()
		}

		submitFormButton.innerText = "Отправка..."

		// Async request to server to save question
		Question.create(question).then(() => {
			questionInput.value = "";
			questionInput.className = "";
			submitFormButton.disabled = true;
			submitFormButton.innerText = "Задать вопрос";
			questionInput.focus();
		})
	}
}

function openModalHandler(){
	const modalTitle = "Авторизация";

	createModal(modalTitle, getAuthForm());
	document
		.getElementById("auth-form")
		.addEventListener("submit", authFormHandler, { once: true })
}

function authFormHandler(event){
	event.preventDefault();

	const button = event.target.querySelector("button");
	button.disabled = true;

	const authData = {
		email: event.target.querySelector("#email").value,
		password: event.target.querySelector("#password").value
	}

	authWithEmailAndPassword(authData)
		.then(Question.fetch)
		.then(renderModalAfterAuth)
		.then(() => button.disabled = false)
}

function renderModalAfterAuth(content){
	const errorTitle = "Ошибка!";
	const successTitle = "Список вопросов";

	
	if(typeof content === "string"){
		createModal(errorTitle, content);
	} else {
		createModal(successTitle, Question.listToHTML(content));
}
}


