d3.json('https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json', function(err, geoData) {
    d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(err, data) {

        var width = '100%',
            height = '100%';
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var chart = d3.select("#chart")
            .attr("width", width)
            .attr("height", height)
            .attr("preserveAspectRatio", "none")
            .append("g")

        var projection = d3.geoMercator()

        var radius = d3.scaleQuantize().domain([d3.min(data.features, function(d) {
            return parseInt(d.properties.mass)
        }), d3.max(data.features, function(d) {
            return parseInt(d.properties.mass)
        })]).range(d3.range(1, 20, 0.01));

        var tooltip = d3.select("#tooltip")
            .style("visibility", "hidden")
            .style("height", 0)
            .style("width", 0);

        chart.selectAll("path")
            .data(topojson.feature(geoData, geoData.objects.countries).features)
            .enter().append("path")
            .attr("d", d3.geoPath().projection(projection));

        chart.selectAll("circle")
            .data(data.features)
            .enter()
            .append("circle")
            .filter(function(d) {
                return d.geometry !== null
            })
            .attr("cx", function(d) {
                return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
            })
            .attr("cy", function(d) {
                return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
            })
            .attr("r", function(d) {
                return radius(d.properties.mass + 1);
            })
            .style("fill", function(d, i) {
                return color(i % 20);
            })
            .style("opacity", 0.8)
            .on("mouseover", function(d) {
                tooltip.select("#mass span").text(d.properties.mass);
                tooltip.select("#year span").text(d.properties.year);
                tooltip.select("#name span").text(d.properties.name);
                tooltip.select("#long span").text(d.properties.reclong);
                tooltip.select("#lat span").text(d.properties.reclat);
                tooltip.select("#nametype span").text(d.properties.nametype);
                tooltip.select("#recclass span").text(d.properties.recclass);
                tooltip.style("visibility", "visible");
                tooltip.style("height", "auto");
                return;
            })
            .on("mousemove", function(d) {
                var position = d3.mouse(this.parentElement.parentElement);
                return tooltip.style("top", (position[1] - 10) + "px")
                    .style("left", (position[0] + 20) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.style("height", 0);
                return tooltip.style("visibility", "hidden");
            });

        function zoomed() {
            chart.attr("transform", d3.event.transform);
        }

        d3.select("#chart").call(d3.zoom().on("zoom", zoomed));

    });
});
