let thoughtsData = JSON.parse(localStorage.getItem('thoughtsData')) || {};

function addThought() {
    let date = document.getElementById("date").value;
    let newThought = document.getElementById("new-thought").value.trim();

    if (!date || newThought === "") return alert("Please select a date and enter a thought!");

    if (!thoughtsData[date]) thoughtsData[date] = [];

    thoughtsData[date].push({ text: newThought, happened: false });
    localStorage.setItem("thoughtsData", JSON.stringify(thoughtsData));

    document.getElementById("new-thought").value = "";
    displayThoughts(date);
}

function displayThoughts(date) {
    let thoughtsList = document.getElementById("thoughts-list");
    thoughtsList.innerHTML = "";

    if (!thoughtsData[date]) return;

    thoughtsData[date].forEach((thought, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${thought.text}
            <input type="checkbox" ${thought.happened ? "checked" : ""} onclick="toggleThought('${date}', ${index})">
        `;
        thoughtsList.appendChild(li);
    });
}

function toggleThought(date, index) {
    thoughtsData[date][index].happened = !thoughtsData[date][index].happened;
    localStorage.setItem("thoughtsData", JSON.stringify(thoughtsData));
}

function calculateRatio() {
    let date = document.getElementById("date").value;
    if (!date || !thoughtsData[date]) return alert("No thoughts found for this date!");

    let totalThoughts = thoughtsData[date].length;
    let trueThoughts = thoughtsData[date].filter(thought => thought.happened).length;
    let percentage = totalThoughts ? ((trueThoughts / totalThoughts) * 100).toFixed(2) : 0;

    document.getElementById("result").innerText = `Negative Expectation Ratio: ${percentage}%`;

    updateChart();
}

function updateChart() {
    let labels = Object.keys(thoughtsData).sort();
    let data = labels.map(date => {
        let total = thoughtsData[date].length;
        let correct = thoughtsData[date].filter(t => t.happened).length;
        return total ? (correct / total) * 100 : 0;
    });

    let ctx = document.getElementById("progressChart").getContext("2d");

    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Negative Expectation Ratio (%)",
                data: data,
                borderColor: "blue",
                fill: false
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}

document.getElementById("date").addEventListener("change", function() {
    displayThoughts(this.value);
    document.getElementById("result").innerText = "";
});
