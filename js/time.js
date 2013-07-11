var maghribSpan, times,
    coordinates, timezone, dst;

var languages = {
    en: {
        label: 'English',
        message: 'Time of Iftar'
    },
    fa: {
        label: 'فارسی',
        message: 'زمان افطار'
    },
    ar: {
        label: 'العربية',
        message: 'وقت الإفطار'
    }
};

function calculateTimes() {
    prayTimes.setMethod('Tehran');
    times = prayTimes.getTimes(new Date(), coordinates, timezone, dst);
}

function update() {
    var maghribTime = times.maghrib.split(':'),
        maghrib = moment().hours(maghribTime[0]).minutes(maghribTime[1]).seconds(0);

    maghribSpan.innerHTML = maghrib.fromNow();
}

function changeLanguage(index) {
    moment.lang(index);
    document.getElementById('-app-time-label').innerHTML = languages[index].message;
    update();
}

function loadLanguages() {
    changeLanguage('en');

    var langsContainer = document.getElementById('-app-langs-container');
    for (var langIndex in languages) {
        var lang = languages[langIndex];
        var span = document.createElement('span');
        span.innerHTML = lang.label;
        span.addEventListener('click', changeLanguage.bind({}, langIndex));
        langsContainer.appendChild(span);
    }
}

function run() {
    maghribSpan = document.getElementById('-app-maghrib-time');

    coordinates = [35.6, 51.4];
    timezone = 3.5;
    dst = 1;

    calculateTimes();
    setInterval(calculateTimes, 1000 * 60);

    update();
    setInterval(update, 1000);

    loadLanguages();

    var iframe = document.getElementById('-app-github-button');
    iframe.src = iframe.attributes['data-src'].value;
}
