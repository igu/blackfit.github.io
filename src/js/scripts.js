const requestURL = 'exampleAPI/dados.json';
const request = new XMLHttpRequest();

window.onload = function () {
    // BLOCO DE IF PARA ADICIONAR O TREINO DO DIA A PARTIR DA API


    if(localStorage.id) return carregarTreino(localStorage.id);

    const cpf = document.getElementById("cpf");
    const busca = document.getElementById("pesquisa");

    const maskOptions = {
        mask: '000.000.000-00'
    };

    const maskCpf = IMask(cpf, maskOptions);

    busca.addEventListener("click", () => {
        carregarTreino(maskCpf.unmaskedValue);
    });
};




function desativaCampo(idElement) {
    let obj = document.getElementById(idElement);

    if (!obj.style.color) {
        obj.style.color = "#7A7A7A";
        upDownProgress(true);
    } else {
        obj.style.color = null;
        upDownProgress(false);
    }

}

function upDownProgress(cond) {

    const statusBar = document.querySelector(".progress"); 
    statusBar.style.transition = "all 0.8s ease-in-out";
    
    const per = document.querySelector(".treino").childElementCount;
    const qtd = 172 / per;

    const valorAtual = (statusBar.style.padding).split('px')[0];

    const result = cond ? qtd + Math.round(valorAtual) : Math.round(valorAtual) - qtd;

    statusBar.style.padding = `${ Math.round(Math.abs(result)) }px`;  

    if (Math.round(result + 1) >= 172 ) {
        let name = document.getElementById("aluno").innerHTML;
        setTimeout(() => alert(`Parabéns ${name}, treino concluido!`), 800);
    }

}

function carregarTreino(cpf) {

    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function () {

        const dados = JSON.parse(JSON.stringify(request.response));

        const user = dados.find(user => user.id === cpf) || "not exists";

        if(user === "not exists")  return alert("Este aluno não existe"); // testar no op ternario
       
        salvarBrowser(cpf);

        const card = document.querySelector(".card");
        const view = document.querySelector(".view");
        const bar  = document.querySelector(".progress-bar");
        
        card.remove();
        view.removeAttribute("style");
        bar.removeAttribute("style");
        
        montarTreino(user);
        
    }

}

function salvarBrowser(cpf){
    localStorage.setItem('id', cpf);
}

function montarTreino(user) {

    const data = new Date(); 
    // add > data.getDay() semana

    const { id, aluno, semana } = user
    const { dia, series, obs } = semana[3]
    document.getElementById("dia").textContent = `${dia} -`;
    document.getElementById("aluno").textContent = `${aluno.toUpperCase()}`;

    const raiz = document.querySelector(".treino");

    for (let i in series) {

        let filhoTemp = document.createElement("li");

        let labelTemp = document.createElement("label");
        labelTemp.setAttribute("class", "checkbox-label");

        let inputTemp = document.createElement("input");
        inputTemp.setAttribute("type", "checkbox");

        let spanTemp = document.createElement("span");
        spanTemp.setAttribute("class", "checkbox-custom");

        let endId = `selecionar-${i}`;
        filhoTemp.setAttribute("id", endId);

        let spanText = document.createElement("span");
        let text = document.createTextNode(series[i]);

        spanText.appendChild(text);
        filhoTemp.appendChild(spanText);

        // filhoTemp.appendChild(text);

        filhoTemp.appendChild(labelTemp);

        inputTemp.setAttribute("onchange", `desativaCampo('${endId}')`);

        labelTemp.appendChild(inputTemp);
        labelTemp.appendChild(spanTemp);

        raiz.appendChild(filhoTemp);
    }

    const ol = document.getElementById("legenda");
    const legendas =  obs.legenda;


    for (let t in legendas)  {

        let elementLi = document.createElement("li");
        let textLi = document.createTextNode(legendas[t]);

        elementLi.appendChild(textLi);
        ol.appendChild(elementLi);
    }

    let elementLi = document.createElement("li");
    let textLi = document.createTextNode(`Intervalo de ${obs.intervalo} segundos entre os exercícios;`);

    elementLi.appendChild(textLi);
    ol.appendChild(elementLi);
}