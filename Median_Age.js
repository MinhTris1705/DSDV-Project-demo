document.addEventListener('DOMContentLoaded', () => {
    // Load and visualize the Median Age data
    fetch('https://raw.githubusercontent.com/MinhTris1705/DSDV-Project-demo/main/datasets/Median_age.csv')
        .then(response => response.text())
        .then(data => {
            var margin = { top: 40, right: 120, bottom: 60, left: 80 },
                width = 800 - margin.right,
                height = 600;

            var svg = d3.select("#median-age-graph")
                .append("svg")
                .attr("width", width + margin.left + margin.right+100)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var rowConverter = function(d) {
                return {
                    Entity: d.Entity,
                    Year: parseInt(d.Year),
                    Median_age: parseFloat(d.Median_age)
                };
            };

            var dataParsed = d3.csvParse(data, rowConverter);

            var bisectYear = d3.bisector(function(d) { return d.Year; }).left;

            var sumstat = d3.nest()
                .key(function(d) { return d.Entity; })
                .entries(dataParsed);

            var x = d3.scaleLinear()
                .domain(d3.extent(dataParsed, function(d) { return d.Year; }))
                .range([0, width]);

            var xAxisGenerator = d3.axisBottom(x)
                .tickFormat(d3.format("d"))
                .ticks(5);

            var xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxisGenerator);

            var y = d3.scaleLinear()
                .domain([15, d3.max(dataParsed, function(d) { return d.Median_age; })])
                .range([height, 0]);

            var yAxis = svg.append("g")
                .call(d3.axisLeft(y));

            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2 + 35)
                .attr("y", height + 45)
                .text("Year");

            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 35)
                .attr("x", -margin.top - height / 2 + 95)
                .text("Age");

            var rest = sumstat.map(function(d) { return d.key; });
            var color = d3.scaleOrdinal()
                .domain(rest)
                .range(['#e6194b', '#3cb44b', '#0082c8', '#f58231', '#ccaa00', '#911eb4', '#46f0f0', '#f032e6', 'rgb(123,120,164)', '#fabebe', '#008080']);

            svg.selectAll(".line")
                .data(sumstat)
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("class", function(d) { return "line " + d.key; })
                .attr("stroke", function(d) { return color(d.key); })
                .attr("stroke-width", 1.5)
                .attr("d", function(d) {
                    return d3.line()
                        .x(function(d) { return x(d.Year); })
                        .y(function(d) { return y(+d.Median_age); })
                        (d.values);
                });

            var highlight = function(d) {
                d3.selectAll(".line")
                    .transition()
                    .duration(300)
                    .attr("opacity", 0.05);

                d3.selectAll("." + d.key)
                    .transition()
                    .duration(200)
                    .attr("opacity", 1)
                    .attr("stroke-width", 5.5);
            };

            var doNotHighlight = function() {
                d3.selectAll(".line")
                    .transition()
                    .duration(500)
                    .attr("opacity", 1)
                    .attr("stroke-width", 1.5);
            };

            var size = 20;
            svg.selectAll("mydots")
                .data(sumstat)
                .enter()
                .append("circle")
                .attr("cx", 750)
                .attr("cy", function(d, i) { return 10 + i * (size + 5); })
                .attr("r", 8)
                .attr("fill", function(d) { return color(d.key); })
                .on("mouseover", highlight)
                .on("mouseleave", doNotHighlight);

            svg.selectAll("mylabels")
                .data(sumstat)
                .enter()
                .append("text")
                .attr("x", 750 + size * 0.85)
                .attr("y", function(d, i) { return i * (size + 5) + (size / 2); })
                .style("fill", function(d) { return color(d.key); })
                .text(function(d) { return d.key; })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .on("mouseover", highlight)
                .on("mouseleave", doNotHighlight);

            svg.append("line")
                .attr("class", "safeLevel")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", y(29.5))
                .attr("y2", y(29.5));

            svg.append("text")
                .attr("class", "avgLabel")
                .attr("x", -30)
                .attr("y", y(29.5) + 5)
                .text("29.5");

            var mouseG = svg.append("g")
                .attr("class", "mouse-over-effects");

            var lines = document.getElementsByClassName('line');

            var mousePerLine = mouseG.selectAll('.mouse-per-line')
                .data(sumstat)
                .enter()
                .append("g")
                .attr("class", "mouse-per-line");

            mousePerLine.append("circle")
                .attr("r", 5)
                .style("stroke", function(d) { return color(d.key); })
                .style("fill", function(d) { return color(d.key); })
                .style("stroke-width", 2)
                .style("opacity", "0");

            mousePerLine.append("text")
                .attr("transform", "translate(10,5)")
                .style("font-size", "12px");

            mouseG.append('svg:rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .on('mouseout', function() {
                    d3.select(".mouse-line")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line text")
                        .style("opacity", "0");
                })
                .on('mouseover', function() {
                    d3.select(".mouse-line")
                        .style("opacity", "1");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "1");
                    d3.selectAll(".mouse-per-line text")
                        .style("opacity", "1");
                })
                .on('mousemove', function() {
                    var mouse = d3.mouse(this);

                    d3.selectAll(".mouse-per-line")
                        .attr("transform", function(d, i) {
                            var xYear = x.invert(mouse[0]),
                                bisect = d3.bisector(function(d) { return d.Year; }).left;
                            var idx = bisect(d.values, xYear);

                            d3.select(this).select("text")
                                .text(y.invert(y(d.values[idx].Median_age)).toFixed(1));

                            d3.select(".mouse-line")
                                .attr("d", function() {
                                    var data = "M" + x(d.values[idx].Year) + "," + height;
                                    data += " " + x(d.values[idx].Year) + "," + 0;
                                    return data;
                                });
                            return "translate(" + x(d.values[idx].Year) + "," + y(d.values[idx].Median_age) + ")";
                        });
                });
        });
});
