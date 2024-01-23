// Place url in variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard at start up 
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to populate for selector
    d3.json(url).then((data) => {
        
        // Set a variable for names
        let names = data.names;

        // Add samples to dropdown selector
        names.forEach((id) => {

            // Log the value of the id 
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // begin with 1st sample
        let sampleOne = names[0];

        // Log value of sample
        console.log(sampleOne);

        // Build initial plots
        buildMetadata(sampleOne);
        buildBarChart(sampleOne);
        buildBubbleChart(sampleOne);
        buildGaugeChart(sampleOne);

    });
};

// Function to populate metadata info
function buildMetadata(sample) {

    // D3 to retrieve all data
    d3.json(url).then((data) => {

        // variable for metadata
        let metadata = data.metadata;

        // Filter based on samples value
        let value = metadata.filter(result => result.id == sample);

        // Log the array of objetcs
        console.log(value)

        // first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log individual key/value pairs 
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function for bar chart
function buildBarChart(sample) {

    // D3 to retrieve data
    d3.json(url).then((data) => {

        // data variable
        let sampleInfo = data.samples;

        // Filter sample value
        let value = sampleInfo.filter(result => result.id == sample);

        // Get first index 
        let valueData = value[0];

        // store as variables
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        
        console.log(otu_ids,otu_labels,sample_values);

        // Set up in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function for bubble chart
function buildBubbleChart(sample) {

    //  D3 to retrieve data
    d3.json(url).then((data) => {
        
        // data variable
        let sampleInfo = data.samples;

        // Filter sample value
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index
        let valueData = value[0];

        // store as variables
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up trace
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Setup layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function when sample is changed
function optionChanged(value) { 

    
    console.log(value); 

    // Call functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Call the initialize function
init();