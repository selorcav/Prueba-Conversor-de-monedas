const valorCLP = document.querySelector("#valorCLP")
const valorConvertir = document.querySelector("#valorConvertir")
const botonConvertir = document.querySelector("#botonConvertir")
const textoConvertir = document.querySelector("#textoConvertir")

let myChart
let opcionSeleccionada

const api = "https://mindicador.cl/api/"


async function getIndicador() {
  try {
    const res = await fetch(api);
    const data = await res.json();
    // console.log(data);

    const opcionesMonedas = ["dolar", "bitcoin", "euro", "uf", "utm"];
    const opcionesFiltradas = Object.fromEntries(
      Object.entries(data).filter(([opcionMoneda]) => opcionesMonedas.includes(opcionMoneda))
    );
    // console.log(opcionesFiltradas);
    return opcionesFiltradas;
  } catch (e) {
    alert(e.message);
  }
}

getIndicador().then((opcionesFiltradas) => {
  // console.log(opcionesFiltradas);

  const opciones = Object.keys(opcionesFiltradas);
  // console.log(opciones)

  opciones.forEach((opcion) => {
    const item = opcionesFiltradas[opcion];
    valorConvertir.innerHTML += `<option value="${opcion}">${item.nombre}</option>`;
  });

  if (valorConvertir.value === "") {
    botonConvertir.disabled = true;
  }

  valorConvertir.addEventListener("change", function () {
    opcionSeleccionada = opcionesFiltradas[valorConvertir.value];
    // console.log(opcionSeleccionada)
    botonConvertir.disabled = !opcionSeleccionada;
  });

  botonConvertir.addEventListener("click", function () {
    // console.log(valorCLP.value)
    if (valorCLP.value == "") {
      alert("No has ingresado un valor")
    }
    else if (opcionSeleccionada) {
      const totalConvertido = (valorCLP.value / opcionSeleccionada.valor).toFixed(2);

      textoConvertir.innerHTML = `<h3>$${valorCLP.value} CLP</h3> <p>Equivalen a </p> <h3> ${totalConvertido}</h3> <p>${opcionSeleccionada.nombre} </p>`
      // console.log(valorCLP.value);
      // console.log(totalConvertido);
      // console.log(valorConvertir.value);

      async function getAndCreateDataToChart() {
        try {
          const res = await fetch(api + opcionSeleccionada.codigo);
          const monedas = await res.json();
          // console.log(monedas)
  
          if (myChart) {
            myChart.destroy();
          }
  
          myChart = new Chart(document.getElementById("myChart"), {
            type: "line",
            data: {
              labels: monedas.serie.map(row => row.fecha),
              datasets: [
                {
                  label: "valor",
                  borderColor: "rgb(75, 192, 192)",
                  data: monedas.serie.map((row) => row.valor),
                },
              ],
            },
          });
        } catch (error) {
          console.error("Error al obtener datos")
          console.error(error)
        }
      }
  
      getAndCreateDataToChart();
    }
  });

});

