let numMaxPosible = 10;
let numeroSecreto = 0;
let intentos = 0;
let listaNumerosSorteados = [];
let numerosIngresados = [];
let probabilidadDatos = []; // Array para almacenar las probabilidades
let rangoInferior = 1; // Rango inferior
let rangoSuperior = numMaxPosible; // Rango superior

// Cargar Google Charts
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(condicionesIniciales);

function asignarTexto(elemento, texto) {
    let elementoHTML = document.querySelector(elemento);
    elementoHTML.innerHTML = texto;
}

function verificarIntento() {
    let numeroDeUsuario = parseInt(document.getElementById('valorUsuario').value);
    numerosIngresados.push(numeroDeUsuario);
    console.log("Números ingresados hasta ahora:", numerosIngresados);

    document.getElementById("reiniciar").removeAttribute("disabled");

    let probabilidad = calcularProbabilidad();
    let probabilidadElemento = document.getElementById("probabilidad-acum");
    probabilidadElemento.innerText = `Probabilidad de acertar en el próximo intento: ${probabilidad}`;

    if (numeroDeUsuario === numeroSecreto) {
        asignarTexto("p", `Acertaste en ${intentos} ${(intentos == 1) ? "intento" : "intentos"}`);
        let media = document.getElementById("media");
        media.innerText = (`Media: ${calcularMedia()}`);

        let mediana = document.getElementById("mediana");
        mediana.innerText = (`Mediana: ${calcularMediana()}`);
    } else {
        if (numeroDeUsuario > numeroSecreto) {
            asignarTexto("p", "El número secreto es menor");
            rangoSuperior = numeroDeUsuario - 1;
        } else {
            asignarTexto("p", "El número secreto es mayor");
            rangoInferior = numeroDeUsuario + 1;
        }
        intentos++;
        calcularNumeroProbable();
        limpiarCaja();
    }

    // Actualiza la lista de probabilidades y dibuja el gráfico
    probabilidadDatos.push([intentos, parseFloat(probabilidad)]);
    dibujarGrafico();
}

function calcularNumeroProbable() {
    // Calcula el número más probable dentro del rango actual
    if (rangoInferior <= rangoSuperior) {
        let numeroProbable = Math.floor((rangoInferior + rangoSuperior) / 2);
        console.log(`Número más probable: ${numeroProbable}`);
        
        // Muestra el número más probable en el HTML
        let probableElemento = document.getElementById("numeroProbable");
        probableElemento.innerText = `Número más probable: ${numeroProbable}`;
    } else {
        console.log("No hay números posibles en el rango.");
    }
}

function condicionesIniciales() {
    asignarTexto('h1', 'Juego del número secreto');
    asignarTexto('p', `Indica un número del 1 al ${numMaxPosible}`);
    numeroSecreto = generarNumeroSecreto();
    intentos = 1;
    console.log(numeroSecreto);
    
    // Muestra la probabilidad inicial
    let probabilidadElemento = document.getElementById("probabilidad");
    let probabilidadInicial = calcularProbabilidadInicial();
    probabilidadElemento.innerText = `Probabilidad inicial de acertar: ${probabilidadInicial}`;

    probabilidadDatos.push([0, parseFloat(probabilidadInicial)]); // Agregar probabilidad inicial
    dibujarGrafico(); // Dibuja el gráfico inicial
}

function limpiarCaja() {
    let valorCaja = document.querySelector('#valorUsuario');
    valorCaja.value = '';
}

function generarNumeroSecreto() {
    let numeroGenerado = Math.floor(Math.random() * numMaxPosible) + 1;

    if (listaNumerosSorteados.length === numMaxPosible) {
        asignarTexto('p', 'Ya se sortearon todos los números posibles');
    } else {
        if (listaNumerosSorteados.includes(numeroGenerado)) {
            return generarNumeroSecreto();
        } else {
            listaNumerosSorteados.push(numeroGenerado);
            return numeroGenerado;
        }
    }
}

function reiniciarJuego() {
    limpiarCaja();
    condicionesIniciales();
    rangoInferior = 1; // Reinicia el rango inferior
    rangoSuperior = numMaxPosible; // Reinicia el rango superior
    document.getElementById("reiniciar").setAttribute("disabled", true);
    document.getElementById("numeroProbable").innerText = ""; // Limpia el número probable
}

// Aplicando estadística
function calcularMedia() {
    let suma = numerosIngresados.reduce((a, b) => a + b, 0);
    return (suma / numerosIngresados.length).toFixed(2);
}

function calcularMediana() {
    let numerosOrdenados = [...numerosIngresados].sort((a, b) => a - b);
    let mitad = Math.floor(numerosOrdenados.length / 2);

    if (numerosOrdenados.length % 2 === 0) {
        // Si hay un número par de elementos, se toma el promedio de los dos valores centrales
        return ((numerosOrdenados[mitad - 1] + numerosOrdenados[mitad]) / 2).toFixed(2);
    } else {
        // Si hay un número impar de elementos, se toma el valor central
        return numerosOrdenados[mitad];
    }
}

function calcularProbabilidadInicial() {
    return (100 / numMaxPosible).toFixed(2) + "%"; // Calcula el porcentaje y lo formatea
}

function calcularProbabilidad() {
    const numerosRestantes = numMaxPosible - numerosIngresados.length; // Cantidad de números restantes
    if (numerosRestantes > 0) {
        return (100 / numerosRestantes).toFixed(2) + "%"; // Calcular y devolver la probabilidad en porcentaje
    } else {
        return "0%"; // Si no quedan números posibles, la probabilidad es 0
    }
}

// Función para dibujar el gráfico
function dibujarGrafico() {
    const data = google.visualization.arrayToDataTable([
        ['Intentos', 'Probabilidad (%)'],
        ...probabilidadDatos // Usar el array de probabilidades
    ]);

    const options = {
        title: 'Probabilidad de Acertar',
        hAxis: { title: 'Intentos' },
        vAxis: { title: 'Probabilidad (%)' },
        legend: 'none',
        series: { 0: { lineWidth: 2 } }
    };

    const chart = new google.visualization.LineChart(document.getElementById('graficoProbabilidad'));
    chart.draw(data, options);
}
