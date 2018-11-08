/**
 * Retrieves the current message given an add-on event.
 * @param {Event} event - Add-on event
 * @return {Message}
 */
function getCurrentMessage(event) {
  var accessToken = event.messageMetadata.accessToken;
  var messageId = event.messageMetadata.messageId;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  return GmailApp.getMessageById(messageId);
}

/**
 * Extracts school information from a message
 *
 * @param {string} message - message to get college info for
 * @return {object} Information about school
 */
function extractSchool(message) {
  var emailRegex = /^"?[^"<]+"?[^<]*<[a-zA-Z0-9._%+-]+@([a-zA-Z0-9+-]+\.)*([a-zA-Z0-9+-]+\.[a-zA-Z]{3})>$/i;
  var match = message.getFrom().match(emailRegex);

  if (!match) {
    return false;
  }
  var emailDomain = match[2];

  var school = queryApi_(
    "school.school_url=www." + emailDomain + "," + emailDomain
  );

  if (school) {
    return getCardData_(school);
  } else if (Object.keys(Domains).indexOf(emailDomain) != -1) {
    school = queryApi_("id=" + Domains[emailDomain]);
    if (school) {
      return getCardData_(school);
    }
  }
  return false;
}

/**
 * Fetches a school's information from the API
 * 
 * @param {string} query - Query to append to the API request
 * @return {object}
 * @private
 */
function queryApi_(query) {
  var fields = [
    "id",
    "school.name",
    "school.school_url",
    "school.city",
    "school.state",
    "school.ownership",
    "latest.student.size",
    "location.lat",
    "location.lon",
    "school.degrees_awarded.predominant",
    "latest.cost.avg_net_price.public",
    "latest.cost.avg_net_price.private",
    "latest.completion.rate_suppressed.lt_four_year_150percent",
    "latest.completion.rate_suppressed.four_year",
    "school.locale",
    "school.price_calculator_url",
    "latest.admissions.admission_rate.overall",
    "latest.admissions.act_scores.25th_percentile.cumulative",
    "latest.admissions.act_scores.75th_percentile.cumulative",
    "latest.admissions.sat_scores.25th_percentile.critical_reading",
    "latest.admissions.sat_scores.75th_percentile.critical_reading",
    "latest.admissions.sat_scores.25th_percentile.math",
    "latest.admissions.sat_scores.75th_percentile.math",
    "latest.admissions.sat_scores.25th_percentile.writing",
    "latest.admissions.sat_scores.75th_percentile.writing",
    "latest.student.part_time_share",
    "latest.student.demographics.race_ethnicity.white",
    "latest.student.demographics.race_ethnicity.black",
    "latest.student.demographics.race_ethnicity.hispanic",
    "latest.student.demographics.race_ethnicity.asian",
    "latest.student.demographics.race_ethnicity.aian",
    "latest.student.demographics.race_ethnicity.nhpi",
    "latest.student.demographics.race_ethnicity.two_or_more",
    "latest.student.demographics.race_ethnicity.non_resident_alien",
    "latest.student.demographics.race_ethnicity.unknown"
  ];

  var baseUrl =
    "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=" +
    Secrets("collegeApi") +
    "&_fields=" +
    fields.join(",");

  var schools = JSON.parse(
    UrlFetchApp.fetch(baseUrl + "&" + query).getContentText()
  );

  if (schools.metadata.total > 0) {
    return schools.results[0];
  }

  return false;
}

/**
 * Builds the card information from the API response
 * 
 * @param {object} school - School information from the API
 * @return {object}
 * @private
 */
function getCardData_(school) {
  return {
    name: school["school.name"],
    id: school.id,
    url: school["school.school_url"],
    location: school["school.city"] + ", " + school["school.state"],
    type: ["Other", "Public", "Private", "For Profit"][
      school["school.ownership"]
    ],
    size: school["latest.student.size"]
      .toString()
      .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,"),
    fulltime:
      100 - parseInt(school["latest.student.part_time_share"] * 100) + "%",
    demographics: getDemographics_(school),
    length: getYears_(school["school.degrees_awarded.predominant"]),
    setting: getLocale_(school["school.locale"]),
    cost: getCost_(
      school["latest.cost.avg_net_price.public"],
      school["latest.cost.avg_net_price.private"],
      school["school.ownership"]
    ),
    calculator: school["school.price_calculator_url"],
    graduationRate:
      parseInt(
        getCompletion_(
          school["school.degrees_awarded.predominant"],
          school["latest.completion.rate_suppressed.lt_four_year_150percent"],
          school["latest.completion.rate_suppressed.four_year"]
        ) * 100
      ) + "%",
    lat: school["location.lat"],
    lon: school["location.lon"],
    admissionRate:
      parseInt(school["latest.admissions.admission_rate.overall"] * 100) + "%",
    sat: getSat_(school),
    act: school["latest.admissions.act_scores.25th_percentile.cumulative"]
      ? school["latest.admissions.act_scores.25th_percentile.cumulative"] +
        " - " +
        school["latest.admissions.act_scores.75th_percentile.cumulative"]
      : false
  };
}

/**
 * Gets the composite SAT score from section scores
 *
 * @param {object} school - School information from API
 * @return {string|boolean}
 * @private
 */
function getSat_(school) {
  var newSat = {
    "600": "400",
    "610": "410",
    "620": "420",
    "630": "430",
    "640": "440",
    "650": "450",
    "660": "460",
    "670": "470",
    "680": "480",
    "690": "490",
    "700": "500",
    "710": "510",
    "720": "520",
    "730": "530",
    "740": "550",
    "750": "560",
    "760": "570",
    "770": "580",
    "780": "590",
    "790": "600",
    "800": "610",
    "810": "620",
    "820": "630",
    "830": "640",
    "840": "650",
    "850": "660",
    "860": "670",
    "870": "680",
    "880": "690",
    "890": "690",
    "900": "700",
    "910": "710",
    "920": "710",
    "930": "720",
    "940": "720",
    "950": "730",
    "960": "740",
    "970": "740",
    "980": "750",
    "990": "760",
    "1000": "760",
    "1010": "770",
    "1020": "770",
    "1030": "780",
    "1040": "790",
    "1050": "790",
    "1060": "800",
    "1070": "810",
    "1080": "810",
    "1090": "820",
    "1100": "820",
    "1110": "830",
    "1120": "840",
    "1130": "840",
    "1140": "850",
    "1150": "860",
    "1160": "860",
    "1170": "870",
    "1180": "880",
    "1190": "880",
    "1200": "890",
    "1210": "900",
    "1220": "910",
    "1230": "910",
    "1240": "920",
    "1250": "930",
    "1260": "930",
    "1270": "940",
    "1280": "950",
    "1290": "950",
    "1300": "960",
    "1310": "970",
    "1320": "970",
    "1330": "980",
    "1340": "990",
    "1350": "990",
    "1360": "1000",
    "1370": "1010",
    "1380": "1010",
    "1390": "1020",
    "1400": "1030",
    "1410": "1030",
    "1420": "1040",
    "1430": "1050",
    "1440": "1050",
    "1450": "1060",
    "1460": "1070",
    "1470": "1070",
    "1480": "1080",
    "1490": "1090",
    "1500": "1090",
    "1510": "1100",
    "1520": "1100",
    "1530": "1110",
    "1540": "1120",
    "1550": "1120",
    "1560": "1130",
    "1570": "1140",
    "1580": "1140",
    "1590": "1150",
    "1600": "1150",
    "1610": "1160",
    "1620": "1170",
    "1630": "1170",
    "1640": "1180",
    "1650": "1190",
    "1660": "1190",
    "1670": "1200",
    "1680": "1210",
    "1690": "1210",
    "1700": "1220",
    "1710": "1230",
    "1720": "1230",
    "1730": "1240",
    "1740": "1240",
    "1750": "1250",
    "1760": "1260",
    "1770": "1260",
    "1780": "1270",
    "1790": "1280",
    "1800": "1280",
    "1810": "1290",
    "1820": "1300",
    "1830": "1300",
    "1840": "1310",
    "1850": "1320",
    "1860": "1320",
    "1870": "1330",
    "1880": "1340",
    "1890": "1340",
    "1900": "1350",
    "1910": "1350",
    "1920": "1360",
    "1930": "1370",
    "1940": "1370",
    "1950": "1380",
    "1960": "1380",
    "1970": "1390",
    "1980": "1390",
    "1990": "1400",
    "2000": "1410",
    "2010": "1410",
    "2020": "1420",
    "2030": "1420",
    "2040": "1430",
    "2050": "1430",
    "2060": "1440",
    "2070": "1440",
    "2080": "1450",
    "2090": "1460",
    "2100": "1460",
    "2110": "1470",
    "2120": "1470",
    "2130": "1480",
    "2140": "1480",
    "2150": "1490",
    "2160": "1490",
    "2170": "1500",
    "2180": "1500",
    "2190": "1510",
    "2200": "1510",
    "2210": "1520",
    "2220": "1520",
    "2230": "1530",
    "2240": "1530",
    "2250": "1540",
    "2260": "1540",
    "2270": "1540",
    "2280": "1550",
    "2290": "1550",
    "2300": "1560",
    "2310": "1560",
    "2320": "1570",
    "2330": "1570",
    "2340": "1570",
    "2350": "1580",
    "2360": "1580",
    "2370": "1590",
    "2380": "1590",
    "2390": "1600",
    "2400": "1600"
  };

  if (
    school["latest.admissions.sat_scores.25th_percentile.critical_reading"] &&
    school["latest.admissions.sat_scores.25th_percentile.writing"] &&
    school["latest.admissions.sat_scores.25th_percentile.math"] &&
    school["latest.admissions.sat_scores.75th_percentile.critical_reading"] &&
    school["latest.admissions.sat_scores.75th_percentile.math"] &&
    school["latest.admissions.sat_scores.75th_percentile.writing"]
  ) {
    var lower =
      school["latest.admissions.sat_scores.25th_percentile.critical_reading"] +
      school["latest.admissions.sat_scores.25th_percentile.writing"] +
      school["latest.admissions.sat_scores.25th_percentile.math"];

    var higher =
      school["latest.admissions.sat_scores.75th_percentile.critical_reading"] +
      school["latest.admissions.sat_scores.75th_percentile.math"] +
      school["latest.admissions.sat_scores.75th_percentile.writing"];

    return (
      lower +
      " - " +
      higher +
      " <i>(" +
      newSat[lower] +
      " - " +
      newSat[higher] +
      ")</i>"
    );
  }
  return false;
}

/**
 * Sorts the demographics by percentage
 *
 * @param {object} school - School information from API
 * @return {array}
 * @private
 */
function getDemographics_(school) {
  var demographics = {
    White: school["latest.student.demographics.race_ethnicity.white"],
    Black: school["latest.student.demographics.race_ethnicity.black"],
    Hispanic: school["latest.student.demographics.race_ethnicity.hispanic"],
    Asian: school["latest.student.demographics.race_ethnicity.asian"],
    "American Indian/Alaskan Native":
      school["latest.student.demographics.race_ethnicity.aian"],
    "Native Hawaiian/Pacific Islander":
      school["latest.student.demographics.race_ethnicity.nhpi"],
    "Two of more races":
      school["latest.student.demographics.race_ethnicity.two_or_more"],
    "Non-resident Alien":
      school["latest.student.demographics.race_ethnicity.non_resident_alien"],
    Unknown: school["latest.student.demographics.race_ethnicity.unknown"]
  };
  var sorted = [];

  Object.keys(demographics).forEach(function(race) {
    sorted.push([race, demographics[race]]);
  });

  sorted.sort(function(a, b) {
    return b[1] - a[1];
  });

  return sorted.map(function(race) {
    if (race[1] > 0.01) {
      return [race[0], parseInt(race[1] * 100) + "%"];
    } else {
      return [race[0], "<1%"];
    }
  });
}

/**
 * Converts the numbered type of school to a string
 *
 * @param {int} type - Type of school
 * @return {string}
 * @private
 */
function getYears_(type) {
  switch (type) {
    case 1:
      return "Certificate";
    case 2:
      return "2 Year";
    case 3:
      return "4 Year";
    case 4:
      return "Graduate";
    default:
      return "Other";
  }
}

/**
 * Gets cost based on whether it's a private or public school
 *
 * @param {int} public - Price for public school
 * @param {int} private - Price for private school
 * @param {int} ownership - Whether school is public, private, or for-profit
 * @return {string}
 * @private
 */
function getCost_(public, private, ownership) {
  if (ownership === 1) {
    return (
      "$" +
      parseInt(public)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
    );
  } else if (ownership === 2 || ownership === 3) {
    return (
      "$" +
      parseInt(private)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
    );
  } else {
    return "Unknown";
  }
}

/**
 * Gets the completion rate based on the type of school
 *
 * @param {int} type - Type of school
 * @param {int} lt - Rate for schools less than 4 years
 * @param {int} four - Rate for schools that are 4 years
 * @return {int|boolean}
 * @private
 */
function getCompletion_(type, lt, four) {
  switch (type) {
    case 1:
      return lt;
    case 2:
      return lt;
    case 3:
      return four;
    case 4:
      return false;
    default:
      return false;
  }
}

/**
 * Gets string locale based on the numbered locale type
 *
 * @param {int} locale - locale from API
 * @return {string}
 * @private
 */
function getLocale_(locale) {
  if (locale === 11 || locale === 12 || locale === 13) {
    return "Urban";
  } else if (locale === 21 || locale === 22 || locale === 23) {
    return "Suburban";
  } else if (locale === 31 || locale === 32 || locale === 33) {
    return "Town";
  } else if (locale === 41 || locale === 42 || locale === 43) {
    return "Rural";
  } else {
    return "Unknown";
  }
}
