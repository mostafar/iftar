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

function changeLocation(data) {
    coordinates = [data.latitude, data.longitude];
    timezone = data.rawOffset / 3600;
    dst = data.dstOffset / 3600;

    // Fix bug in data for Tehran!
    if (timezone == 3.5) {
        dst = 1;
    }

    var sum = timezone + dst;
    //    Asia/Tehran - Iran Standard Time UTC +04:30 (35.3535455, 51.3435345)
    var str = data.timeZoneId + ' - ' + data.timeZoneName + ' UTC ' +
        (sum > 0 ? '+' : '') + Math.floor(sum) + ':' + (sum == Math.floor(sum) ? '00' : '30') +
        ' (' + data.latitude + ', ' + data.longitude + ')';

    document.getElementById('-app-location').innerHTML = str;

    calculateTimes();
    update();
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

    changeLocation({
        dstOffset: 0.0,
        rawOffset: 12600.0,
        timeZoneId: 'Asia/Tehran',
        timeZoneName: 'Iran Standard Time',
        latitude: 35.5,
        longitude: 51.6
    });

    setInterval(calculateTimes, 1000 * 60);
    setInterval(update, 1000);

    loadLanguages();

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function (position) {
            requestTimeZone(position.coords.latitude, position.coords.longitude);
        });
    }

    var iframe = document.getElementById('-app-github-button');
    iframe.src = iframe.attributes['data-src'].value;
}
