/**
 * Creates a card for display error details.
 *
 * @param {Object} opts Parameters for building the card
 * @param {Error} opts.exception - Exception that caused the error
 * @param {string} opts.errorText - Error message to show
 * @param {boolean} opts.showStackTrace - True if full stack trace should be displayed
 * @return {Card}
 */
function buildErrorCard(opts) {
  var errorText = opts.errorText;

  if (opts.exception && !errorText) {
    errorText = opts.exception.toString();
  }

  if (!errorText) {
    errorText = "No additional information is available.";
  }

  var card = CardService.newCardBuilder();
  card.setHeader(
    CardService.newCardHeader().setTitle("An unexpected error occurred")
  );
  card.addSection(
    CardService.newCardSection().addWidget(
      CardService.newTextParagraph().setText(errorText)
    )
  );

  if (opts.showStackTrace && opts.exception && opts.exception.stack) {
    var stack = opts.exception.stack.replace(/\n/g, "<br/>");
    card.addSection(
      CardService.newCardSection()
        .setHeader("Stack trace")
        .addWidget(CardService.newTextParagraph().setText(stack))
    );
  }

  return card.build();
}

/**
 * Creates a card displaying details about a school.
 *
 * @param {Object} opts Parameters for building the card
 * @param {string} opts.id - School's 6-digit id
 * @param {string} opts.name - School's name
 * @param {string} opts.url - Link to the school's website
 * @param {string} opts.location - School's city/state
 * @param {string} opts.length - Whether the school is 4 or 2 year
 * @param {string} opts.type - Whether the school is public or private
 * @param {string} opts.setting - The setting of the school (urban, suburban, rural, etc)
 * @param {string} opts.size - The total undergraduate enrollment of the school
 * @param {string} opts.fulltime - The rate of fulltime students
 * @param {array} opts.demographics - An object of the school's demographics sorted by percentage
 * @param {string} opts.cost - The average net cost
 * @param {string} opts.graduationRate - The six-year graduation rate
 * @param {string} opts.lat - The latitude of the school
 * @param {string} opts.lon - The longitude of the school
 * @param {string} opts.admissionRate - The admission rate
 * @param {object} opts.sat - The middle 50% SAT scores (Reading, writing, math)
 * @param {string} opts.act - The middle 50% ACT scores
 * @return {Card}
 */
function buildCollegeCard(opts) {
  var header = CardService.newCardHeader()
    .setTitle(opts.name)
    .setImageUrl(
      Utilities.formatString("https://logo.clearbit.com/%s?size=32", opts.url)
    );

  var studentsSection = CardService.newCardSection()
    .setHeader("Student Body")
    .addWidget(
      createKeyValue_(
        "Undergraduate Enrollment",
        CardService.Icon.MULTIPLE_PEOPLE,
        opts.size
      )
    )
    .addWidget(
      createKeyValue_(
        "Full Time Students",
        CardService.Icon.CLOCK,
        opts.fulltime
      )
    )
    .setCollapsible(true)
    .setNumUncollapsibleWidgets(1)
    .addWidget(
      createKeyValue_(
        "Undergraduate",
        CardService.Icon.PERSON,
        "Race/Ethnicity:"
      )
    );

  opts.demographics.forEach(function(race) {
    studentsSection.addWidget(
      createKeyValue_(race[0], false, race[1]).setIconUrl(
        "data:image/png;base64,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"
      )
    );
  });

  var card = CardService.newCardBuilder()
    .setHeader(header)
    .addCardAction(
      CardService.newCardAction()
        .setText("View Website")
        .setOpenLink(createExternalLink_(opts.url))
    )
    .addCardAction(
      CardService.newCardAction()
        .setText("View Full Scorecard")
        .setOpenLink(
          createExternalLink_(
            Utilities.formatString(
              "https://collegescorecard.ed.gov/school/?%s",
              opts.id
            )
          )
        )
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newTextButton()
            .setText(opts.url.replace(/(www\.|www2\.|https?:\/\/|\/$)/gi, ""))
            .setOpenLink(createExternalLink_(opts.url))
        )
        .addWidget(
          CardService.newKeyValue()
            .setIcon(CardService.Icon.MAP_PIN)
            .setContent(defaultTo_(opts.location, "---"))
            .setButton(
              CardService.newTextButton()
                .setText("Directions")
                .setOpenLink(
                  createExternalLink_(
                    Utilities.formatString(
                      "www.google.com/maps/dir/?api=1&destination=%s,%s",
                      opts.lat,
                      opts.lon
                    )
                  )
                )
            )
        )
        .addWidget(
          CardService.newImage()
            .setAltText(Utilities.formatString("Map of %s", opts.name))
            .setImageUrl(
              Utilities.formatString(
                "https://www.mapquestapi.com/staticmap/v5/map?key=%s&locations=%s,%s&defaultMarker=marker-1e88e5&size=400,200&zoom=10",
                Secrets("mapquest"),
                opts.lat,
                opts.lon
              )
            )
        )
    )
    .addSection(
      CardService.newCardSection()
        .setHeader("Details")
        .addWidget(
          createKeyValue_(
            false,
            CardService.Icon.STAR,
            Utilities.formatString(
              "%s | %s | %s",
              opts.setting,
              opts.length,
              opts.type
            )
          )
        )
        .addWidget(
          createKeyValue_(
            "Average Cost",
            CardService.Icon.DOLLAR,
            opts.cost
          ).setButton(
            CardService.newTextButton()
              .setText("Calculator")
              .setOpenLink(createExternalLink_(opts.calculator))
          )
        )
        .addWidget(
          createKeyValue_(
            "Graduation Rate",
            CardService.Icon.BOOKMARK,
            opts.graduationRate
          )
        )
    )
    .addSection(studentsSection)
    .addSection(
      CardService.newCardSection()
        .setHeader("Admissions (Fall 2015)")
        .addWidget(
          createKeyValue_("Admissions Rate", false, opts.admissionRate)
        )
        .addWidget(createKeyValue_("SAT Middle 50%", false, opts.sat))
        .addWidget(createKeyValue_("ACT Middle 50%", false, opts.act))
    )
    .addSection(
      CardService.newCardSection().addWidget(
        createKeyValue_(
          "School logo provided by:",
          false,
          '<a href="https://clearbit.com">Clearbit</a>'
        ).setButton(
          CardService.newTextButton()
            .setText("GitHub")
            .setOpenLink(
              createExternalLink_(
                "https://github.com/kirpal/gmail-college-scorecard"
              )
            )
        )
      )
    );
  return card.build();
}

/**
 * Choses between a value and a default placeholder. The placeholder
 * is used if the value is falsy.
 *
 * @param {Object} value - Value to check/return
 * @param {Object} defaultValue - Value to return if original value not valid.
 * @return {Object}
 * @private
 */
function defaultTo_(value, defaultValue) {
  if (!value || value.length === 0) {
    value = null;
  }
  return value == null || value !== value ? defaultValue : value;
}

/**
 * Creates a key/value widget. Simple wrapper to reduce boilerplace code.
 *
 * @param {string} label - Top label of widget
 * @param {Icon} icon - Icon
 * @param {string} value - Main content
 * @return {KeyValue}
 * @private
 */
function createKeyValue_(label, icon, value) {
  if (label && icon) {
    return CardService.newKeyValue()
      .setTopLabel(label)
      .setIcon(icon)
      .setContent(defaultTo_(value, "---"));
  } else if (label) {
    return CardService.newKeyValue()
      .setTopLabel(label)
      .setContent(defaultTo_(value, "---"));
  } else if (icon) {
    return CardService.newKeyValue()
      .setIcon(icon)
      .setContent(defaultTo_(value, "---"));
  }
}

/**
 * Creates a link to an external URL.
 *
 * @param {string} url - URL to link to 
 * @return {OpenLink}
 * @private
 */
function createExternalLink_(url) {
  return CardService.newOpenLink()
    .setUrl(
      Utilities.formatString("https://%s", url.replace(/https?:\/\//gi, ""))
    )
    .setOpenAs(CardService.OpenAs.FULL_SIZE);
}
