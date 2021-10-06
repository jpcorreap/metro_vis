const data_url =
  "https://raw.githubusercontent.com/jpcorreap/metro_vis/master/afluencia_2020.json";

(width = 600), (height = 230);
var margin = {
  top: 10,
  right: 50,
  bottom: 50,
  left: 60,
};

let filterDate = new Date(2019, 1, 31);
let filterLinea = "Línea B";

var getData = async (date, linea) => {
  const urls = [
    "https://raw.githubusercontent.com/jpcorreap/metro_vis/master/data/2019.json",
    "https://raw.githubusercontent.com/jpcorreap/metro_vis/master/data/2020.json",
    "https://raw.githubusercontent.com/jpcorreap/metro_vis/master/data/2021.json",
  ];

  const data = [];

  // Fetches all data required to vis
  const promises = urls.map((url) =>
    fetch(url).then((response) => response.json())
  );

  const responses = await Promise.all(promises);

  let splitted = "",
    day = 0,
    month = 0,
    year = 0;

  // Parses dates and pushes all data to the data array
  responses.forEach((yearData) => {
    yearData.forEach((register) => {
      splitted = register.dia.split("-");
      day = +splitted[0];
      month = +splitted[1];
      year = +splitted[2];

      data.push({ ...register, dia: new Date(year, month - 1, day) });
    });
  });

  const filtered = data.filter(
    (register) =>
      register.dia.getTime() === filterDate.getTime() &&
      register.linea === filterLinea
  )[0];

  console.info(filterDate)
  console.info(filterLinea)
  console.info(filtered)
  
  if(!filtered) {
    return [];
  }

  const dataVis = [];

  for (let index = 4; index < 24; index++) {
    if (filtered[index + ":00"]) {
      dataVis.push({ anio: index + "h", val: filtered[index + ":00"] });
    }
  }

  console.log(dataVis);

  viz(dataVis);
  return dataVis;
};

var viz = (data) => {
  console.log(data);
  x = d3
    .scaleBand()
    .domain(data.map((d) => d.anio))
    .rangeRound([margin.left, width - margin.right]);
  y = d3
    .scaleLinear()
    .domain([d3.max(data, (d) => +d.val), d3.min(data, (d) => +d.val) - 100]) //por que se pone max-min
    .range([margin.top, height - margin.bottom]);

  yAxis = (g) =>
    g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
  xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

  svg = d3
    .select(".dataviz > svg")
    .attr("id", "viz")
    .attr("viewBox", [0, 0, width, height]);
  svg
    .selectAll(".bars")
    .data([data])
    .join("g")
    .attr("class", "bars")
    .attr("fill", "#00d1b2")
    .selectAll("rect")
    .data((d) => d)
    .join("rect")
    .attr("x", (d) => x(d.anio))
    .attr("y", (d) => y(+d.val))
    .attr("width", 10)
    .attr("height", (d) => y(d3.min(data, (d) => +d.val) - 100) - y(+d.val));

  svg
    .selectAll(".xaxis")
    .data([0])
    .join("g")
    .attr("class", "xaxis")
    .call(xAxis);

  svg
    .selectAll(".yaxis")
    .data([0])
    .join("g")
    .attr("class", "yaxis")
    .call(yAxis);
};

const desactivateOtherButtons = (line) => {
  var buttons = document.getElementsByTagName("button");

  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.classList.remove("is-primary");
  }

  document.getElementById("L" + line).classList.add("is-primary");
};

const receiveDay = (date) => {
  filterDate = date;
  getData(date, filterLinea);
};

const receiveLine = (linea) => {
  desactivateOtherButtons(linea);
  filterLinea = "Línea " + linea;
  getData(filterDate, linea);
};

getData(filterDate, filterLinea);
