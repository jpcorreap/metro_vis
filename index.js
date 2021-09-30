const data_url =
  "https://raw.githubusercontent.com/jpcorreap/metro_vis/master/afluencia_2020.json";

(width = 550), (height = 230);
var margin = {
  top: 10,
  right: 50,
  bottom: 50,
  left: 60,
};

var getData = (url, filter) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let dataFiltrada = data.filter((d) => d.linea == "A");
      dataFiltrada = data.filter((d) => d.dia.includes(filter));
      const dataVis = dataFiltrada.map((d) => {
        let dia = d.dia.slice(0, 2);
        if (dia.startsWith("0")) {
          dia = dia.slice(1, 2);
        }

        return {
          anio: dia,
          val: +d.total,
        };
      });
      viz(dataVis);
    });
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

const filterByMonth = (month) => {
  getData(data_url, month);
  var buttons = document.getElementsByTagName("button");

  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.classList.remove("is-primary");
  }

  document.getElementById(month).classList.add("is-primary");
};

getData(data_url, "-01-");
