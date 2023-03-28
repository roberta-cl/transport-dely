let totalVehiclesSmall = 0;
let totalItemsSmall = 0;

let totalVehiclesMedium = 0;
let totalItemsMedium = 0;

let totalVehiclesLarge = 0;
let totalItemsLarge = 0;

// Chart model
const CHART_OPTIONS = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const CHART_DATA = {
  labels: [
    "Custo Médio por KM",
    "Total de Veículos Deslocados",
    "Total de Itens Transportados",
  ],
  datasets: [
    {
      backgroundColor: [
        "rgb(255, 135, 201, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColor: [
        "rgb(255, 135, 201, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// Create chart
function createChart(canvas, label, data) {
  const ctx = canvas.getContext("2d");

  const chartData = {
    ...CHART_DATA,
    datasets: [
      {
        ...CHART_DATA.datasets[0],
        label,
        data,
      },
    ],
  };

  return new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: CHART_OPTIONS,
  });
}

// Create small chart
function createSmallChart(totalVehicles, totalItems) {
  return createChart(
    document.getElementById("chart_small"),
    "Caminhão de Pequeno Porte",
    [4.87, totalVehicles, totalItems]
  );
}

// Create medium chart
function createMediumChart(totalVehicles, totalItems) {
  return createChart(
    document.getElementById("chart_medium"),
    "Caminhão de Médio Porte",
    [11.92, totalVehicles, totalItems]
  );
}

// Create large chart
function createLargeChart(totalVehicles, totalItems) {
  return createChart(
    document.getElementById("chart_large"),
    "Caminhão de Grande Porte",
    [27.44, totalVehicles, totalItems]
  );
}

// Update chart
function updateChart(id, totalVehicles, totalItems) {
  Chart.getChart(id).data.datasets[0].data[1] = totalVehicles;
  Chart.getChart(id).update();
  Chart.getChart(id).data.datasets[0].data[2] = totalItems;
  Chart.getChart(id).update();
}

// Reset chart
function resetChart(id) {
  Chart.getChart(id).data.datasets[0].data[1] = 0;
  Chart.getChart(id).update();
  Chart.getChart(id).data.datasets[0].data[2] = 0;
  Chart.getChart(id).update();
}

// Get city name
function getCityName(name) {
  return name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Calculate distance
function calculateDistance(origin, destination, cities, data) {
  const inputOrigin = getCityName(origin);
  const inputDestination = getCityName(destination);

  const indexOrigin = cities.indexOf(inputOrigin);
  const indexDestination = cities.indexOf(inputDestination);

  const distance = data[indexOrigin + 1][indexDestination];
  return parseInt(distance);
}

// Get modality
function getModality() {
  const selectModality = document.getElementById("modality_1");
  const selectedOption =
    selectModality.options[selectModality.selectedIndex].text.toUpperCase();
  return selectedOption;
}

// Get modality value
function getModalityValue() {
  const selectModality = document.getElementById("modality_1");
  const selectedOption = selectModality.options[selectModality.selectedIndex];
  const modalityValue = selectedOption.value.replace(",", ".");
  return modalityValue;
}

// Calculate cost
function calculateCost(distance, modality) {
  const cost = distance * modality;
  return cost.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Validate simple transport
function validateSimpleTransport(
  indexOrigin,
  indexDestination,
  origin,
  destination,
  distance,
  modality,
  modalityValue
) {
  if (indexOrigin === -1 && indexDestination === -1) {
    return "Cidades inexistentes! Tente novamente.";
  } else if (indexDestination === -1) {
    return "Cidade de destino inexistente! Tente novamente.";
  } else if (indexOrigin === -1) {
    return "Cidade de origem inexistente! Tente novamente.";
  } else if (indexOrigin === indexDestination) {
    return "A cidade de origem é igual a cidade de destino! Tente novamente.";
  } else {
    return `De ${origin} para ${destination}, utilizando um
      ${modality}, a distância é de ${distance} km e o custo será de ${calculateCost(
      distance,
      modalityValue
    )}.`;
  }
}

// Validate complex transport
function validateComplexTransport(
  indexOrigin,
  indexStop,
  indexDestination,
  origin,
  stop,
  destination,
  distance
) {
  if (indexOrigin === -1 && indexDestination === -1 && indexStop === -1) {
    return "Cidades inexistentes! Tente novamente.";
  } else if (indexOrigin === -1 && indexDestination === -1) {
    return "Cidades de origem e destino inexistentes! Tente novamente.";
  } else if (indexOrigin === -1 && indexStop === -1) {
    return "Cidades de origem e parada inexistentes! Tente novamente.";
  } else if (indexDestination === -1 && indexStop === -1) {
    return "Cidades de parada e destino inexistentes! Tente novamente.";
  } else if (indexDestination === -1) {
    return "Cidade de destino inexistente! Tente novamente.";
  } else if (indexOrigin === -1) {
    return "Cidade de origem inexistente! Tente novamente.";
  } else if (indexStop === -1) {
    return "Cidade de parada inexistente! Tente novamente.";
  } else if (
    indexStop === indexDestination &&
    indexStop === indexOrigin &&
    indexOrigin === indexDestination
  ) {
    return "As cidades de origem, parada e destino são iguais! Tente novamente.";
  } else if (indexOrigin === indexStop) {
    return "A cidade de origem é igual a cidade de parada! Tente novamente.";
  } else if (indexStop === indexDestination) {
    return "A cidade de parada é igual a cidade de destino! Tente novamente.";
  } else {
    document.getElementById("result_items_2").innerText =
      calculateItems(distance);

    return `De ${origin} para ${destination}, com parada em ${stop}, a distância a ser percorrida é de ${distance} km.`;
  }
}

// Items result message
function itemsResult(
  selectedItems,
  totalItems,
  modality,
  modalityValue,
  distance
) {
  return `Para o transporte do(s) 
  produto(s) ${selectedItems.join(
    ", "
  )}, será necessário utilizar um ${modality}, a resultar no menor custo de transporte por km rodado. 
    
    O valor total do transporte é de ${(
      distance * modalityValue
    ).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}, sendo ${((distance * modalityValue) / totalItems).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )} o custo unitário médio.`;
}

// Calculate items
function calculateItems(distance) {
  const submit_2 = document.getElementById("submit_2");

  const celular = document.getElementById("celular");
  const geladeira = document.getElementById("geladeira");
  const freezer = document.getElementById("freezer");
  const cadeira = document.getElementById("cadeira");
  const luminaria = document.getElementById("luminaria");
  const lavadora = document.getElementById("lavadora");
  const inputItems = [
    celular,
    geladeira,
    freezer,
    cadeira,
    luminaria,
    lavadora,
  ];
  const itemsKg = [0.5, 60, 100, 5, 0.8, 120];
  let selectedItems = [];
  let selectedItemsKg = [];
  let totalItems = 0;
  let totalKg = 0;

  inputItems.forEach((item) => {
    if (parseInt(item.value) !== 0) {
      totalItems += parseInt(item.value);
      selectedItems.push(item.name.toUpperCase());
      selectedItemsKg.push(item.value * itemsKg[inputItems.indexOf(item)]);
    }
  });

  for (let i = 0; i < selectedItemsKg.length; i++) {
    totalKg += selectedItemsKg[i];
  }

  if (totalKg === 0) {
    return "Você não selecionou nenhum item para transporte! Tente novamente.";
  } else if (totalKg <= 1000) {
    submit_2.innerText = "Cotar novamente";

    totalVehiclesSmall++;
    totalItemsSmall = totalItemsSmall += totalItems;
    updateChart("chart_small", totalVehiclesSmall, totalItemsSmall);

    return itemsResult(
      selectedItems,
      totalItems,
      "Caminhão de Pequeno Porte",
      4.87,
      distance
    );
  } else if (totalKg > 1000 && totalKg <= 4000) {
    submit_2.innerText = "Cotar novamente";

    totalVehiclesMedium++;
    totalItemsMedium = totalItemsMedium += totalItems;
    updateChart("chart_medium", totalVehiclesMedium, totalItemsMedium);

    return itemsResult(
      selectedItems,
      totalItems,
      "Caminhão de Médio Porte",
      11.92,
      distance
    );
  } else if (totalKg > 4000 && totalKg <= 10000) {
    submit_2.innerText = "Cotar novamente";

    totalVehiclesLarge++;
    totalItemsLarge = totalItemsLarge += totalItems;
    updateChart("chart_large", totalVehiclesLarge, totalItemsLarge);

    return itemsResult(
      selectedItems,
      totalItems,
      "Caminhão de Grande Porte",
      27.44,
      distance
    );
  }
}

// Parse CSV file
function parseCSV(file, submit_1, submit_2, reset) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      download: true,
      complete: function (results) {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data);

          const cities = results.data[0];

          submit_1.addEventListener("click", () => {
            const origin = document.getElementById("origin_1").value;
            const destination = document.getElementById("destination_1").value;

            const inputOrigin = getCityName(origin);
            const inputDestination = getCityName(destination);

            const indexOrigin = cities.indexOf(inputOrigin);
            const indexDestination = cities.indexOf(inputDestination);

            document.getElementById("result_1").innerText =
              validateSimpleTransport(
                indexOrigin,
                indexDestination,
                inputOrigin,
                inputDestination,
                calculateDistance(
                  inputOrigin,
                  inputDestination,
                  cities,
                  results.data
                ),
                getModality(),
                getModalityValue()
              );

            submit_1.innerText = "Cotar novamente";
          });

          createSmallChart(totalVehiclesSmall, totalItemsSmall);
          createMediumChart(totalVehiclesMedium, totalItemsMedium);
          createLargeChart(totalVehiclesLarge, totalItemsLarge);

          submit_2.addEventListener("click", () => {
            document.getElementById("result_items_2").innerText = "";

            const origin = document.getElementById("origin_2").value;
            const stop = document.getElementById("stop_2").value;
            const destination = document.getElementById("destination_2").value;

            const inputOrigin = getCityName(origin);
            const inputStop = getCityName(stop);
            const inputDestination = getCityName(destination);

            const indexOrigin = cities.indexOf(inputOrigin);
            const indexStop = cities.indexOf(inputStop);
            const indexDestination = cities.indexOf(inputDestination);

            const distanceOriginToStop =
              results.data[indexOrigin + 1][indexStop];
            const distanceStopToDestination =
              results.data[indexStop + 1][indexDestination];
            const distance =
              parseInt(distanceOriginToStop) +
              parseInt(distanceStopToDestination);

            document.getElementById("result_2").innerText =
              validateComplexTransport(
                indexOrigin,
                indexStop,
                indexDestination,
                inputOrigin,
                inputStop,
                inputDestination,
                distance
              );
          });

          reset.addEventListener("click", () => {
            resetChart("chart_small");
            resetChart("chart_medium");
            resetChart("chart_large");

            setTimeout(() => {
              location.reload();
            }, 1000);
          });
        }
      },
    });
  });
}

parseCSV(
  "DNIT-Distancias.csv",
  document.getElementById("submit_1"),
  document.getElementById("submit_2"),
  document.getElementById("reset")
);
