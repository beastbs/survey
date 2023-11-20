export class Question {
  static firebaseURL = "https://fb-data-pro-default-rtdb.europe-west1.firebasedatabase.app/";
  static questions = "questions";

  static create(question) {
    return fetch(`${Question.firebaseURL}questions.json`,{
        method: "POST",
        body: JSON.stringify(question),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
      .catch(error => {
        document.querySelector("#form > div")
          .insertAdjacentHTML("beforeend",`<p class="error">${error.message}</p>`)

        setTimeout(() => {
          document.querySelector("#form .error").remove();
        }, 3000)
        
        console.error(error);
      })
  }

  static fetch(token){
	if(!token){
		return Promise.resolve("<p class='error'>У вас не токена</p>")
	}

	return fetch(`${Question.firebaseURL}questions.json?auth=${token}`)
	.then(response => response.json())
	.then(response => {
    console.log("Response", response)

		if(response?.error){
			return `<p class="error">${response.error}</p>`
		}

		return response ? Object.keys(response).map(key => ({...response[key], id: key})) : []
	})
  }

  static renderList() {
    const questions = getQuestionsFromLocalStorage();
    const noQuestions = `<div class="mui--text-headline">Вы пока ничего не спрашивали</div>`;

    const html = questions.length 
      ? questions.map(toCard).join("")
      : noQuestions

    const list = document.getElementById("list");
    list.innerHTML = html;
  }

  static listToHTML(questions){
    return questions.length 
      ? `<ol class='question-list'>${questions.map(q => `<li>${q.text}</li>`).join("")}</ol>`
      : `<p>Вопросов пока нет!</p>`
  }
}

function addToLocalStorage(question) {
  const all = getQuestionsFromLocalStorage();
  all.push(question);
  localStorage.setItem(Question.questions, JSON.stringify(all));
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem(Question.questions)) || [];
}

export function toCard(question) {
  return `
		<div class="mui--text-black-54">
			${new Date(question.date).toLocaleDateString()}
			${new Date(question.date).toLocaleTimeString()}
		</div>
		<div>
			${question.text}
		</div>
		<br />
	`;
}
