// Define a variable to hold the json URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Initialize the page with a dropdown menu of all Test Subject IDs and default charts from the first Test Subject ID
function init() {
    let dropDown = d3.select("#selDataset");
    d3.json(url).then((jsonData) => {
        let sampleIds = jsonData.names;
        sampleIds.map((sampleID) => {
            dropDown.append("option").text(sampleID).property("value", sampleID);
        });
        let initSample = sampleIds[0];
        buildMetadata(initSample);
        buildCharts(initSample);
    });
}

// Functions for building charts for each Test Subject ID
function buildCharts(sample) {
    // Reads data from URL
    d3.json(url).then(function (jsonData) {
        // Define variables for charts
        let samples = jsonData.samples;
        let sampleInfo = samples.filter(row => row.id == sample);
        let sampleValues = sampleInfo[0].sample_values;
        let sampleValuesSlice = sampleValues.slice(0,10).reverse();
        let otuIds = sampleInfo[0].otu_ids;
        let otuIdsSlice = otuIds.slice(0,10).reverse();
        let otuLabels = sampleInfo[0].otu_labels;
        let otuLabelsSlice = otuLabels.slice(0,10).reverse();
        let metaData = jsonData.metadata;
        let metaDataSample = metaData.filter(row => row.id == sample);
        let washFreq = metaDataSample[0].wfreq

        // Bar Chart
        let trace1 = {
            x: sampleValuesSlice,
            y: otuIdsSlice.map(id => `OTU ${id}`),
            type: "bar",
            orientation: "h",
            text: otuLabelsSlice
        };

        let data1 = [trace1];

        let layout1 = {
            title: {text: "<b>Top 10 OTUs Found in Test Subject</b>"}
        };

        Plotly.newPlot("bar", data1, layout1)

        // Bubble Chart
        let trace2 = {
            x: otuIds,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            },
            text: otuLabels
        };

        let data2 = [trace2];

        let layout2 = {
            title: {text: "<b>OTUs Found in Test Subject</b>"},
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", data2, layout2);

        // Gauge Chart (Bonus)
        let trace3 =   {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              axis: { range: [null, 9] },
              steps: [
                { range: [0, 1], color: "#f8f3ec" }, 
                { range: [1, 2], color: "#f4f1e4" }, 
                { range: [2, 3], color: "#e9e7c9" }, 
                { range: [3, 4], color: "#e5e8b0" }, 
                { range: [4, 5], color: "#d5e599" }, 
                { range: [5, 6], color: "#b7cd8f" }, 
                { range: [6, 7], color: "#8bc086" }, 
                { range: [7, 8], color: "#89bc8d" }, 
                { range: [8, 9], color: "#84b589" }, 
              ],
              bar: {
                color: "black",
                thickness: 0.25,
              },
              threshold: {
                line: { color: "black", width: 5 },
                thickness: 0.8,
                value: washFreq,
              },
            },
          };

        let data3 = [trace3];

        Plotly.newPlot("gauge", data3);

    });
};


// Function for building metadata table for each Test Subject ID
function buildMetadata(sample) {
    let Meta = d3.select("#sample-metadata");
    Meta.html("");
    d3.json(url).then(function (jsonData) {
        let metaData = jsonData.metadata;
        let metaDataSample = metaData.filter(row => row.id == sample);
        metaDataSample.map((row) => {
            Object.entries(row).map(([key, value]) => {
                Meta.append("p").text(`${key}: ${value}`);
            });  
        });
    });
};

// Function for updating the charts and table when a new sample is selected
function optionChanged(sample) {
    buildMetadata(sample);
    buildCharts(sample);
};

// Display default charts and table
init();