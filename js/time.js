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

function changeLocation(location) {
    coordinates = [location.latitude, location.longitude];
    timezone = location.rawOffset / 3600;
    dst = location.dstOffset / 3600;

    // Fix bug in data for Tehran!
    if (timezone == 3.5) {
        dst = 1;
    }
}

function requestTimeZone(latitude, longitude) {
	var ajax;

	try {
		// Opera 8.0+, Firefox, Safari
		ajax = new XMLHttpRequest();
	} catch (e) {
		// Internet Explorer Browsers
		try {
			ajax = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				ajax = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				// Something went wrong
				return false;
			}
		}
	}

    ajax.onreadystatechange = function() {
        if (ajax.readyState==4 && ajax.status==200)
        {
            var result = ajax.responseText;
            if (result == 'error') {
                return false;
            }

            var data = JSON.parse(result);
            data.latitude = latitude;
            data.longitude = longitude;
            changeLocation(data);
        }
    };

    ajax.open('GET', 'timezone.php?latitude=' + latitude + '&longitude=' + longitude, true);
    ajax.send();
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
