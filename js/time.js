var maghribSpan, times,
    coordinates, timezone, dst;

function calculateTimes() {
    prayTimes.setMethod('Tehran');
    times = prayTimes.getTimes(new Date(), coordinates, timezone, dst);
}

function update() {
    var maghribTime = times.maghrib.split(':'),
        maghrib = moment().hours(maghribTime[0]).minutes(maghribTime[1]).seconds(0);

    maghribSpan.innerHTML = maghrib.fromNow();
}

function run() {
    var iframe = document.getElementById('-app-github-button');
    iframe.src = iframe.attributes['data-src'].value;

    maghribSpan = document.getElementById('-app-maghrib-time');

    coordinates = [35.6, 51.4];
    timezone = 3.5;
    dst = 1;

    calculateTimes();
    setInterval(calculateTimes, 1000 * 60);

    update();
    setInterval(update, 1000);
}
