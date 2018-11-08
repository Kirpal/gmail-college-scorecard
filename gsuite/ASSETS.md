# Assets Required for GSuite Store Listing:

## Graphics

Marketplace listings use graphics to illustrate and advertise applications. You must provide the graphics used in your listing, with the specified image sizes.

The following additional graphic assets are required to build the G Suite Marketplace listing for your application:

- [x] An application banner image. Sized to 220 x 140 pixels. *(assets/banner.png)*

- [x] Screenshots of your application. At least one is required, but you can optionally provide up to five screenshots. These should be 1280 x 800 pixels in size. If necessary, screenshots 640 x 400 pixels or 2560 x 1600 pixels in size can be used. Your screenshots should have square corners and no padding (full bleed). *(assets/screenshot{1-4}.png)*

- [x] Icon images. All applications require one icon image sized to 128 x 128 pixels and another to 32 x 32 pixels. Applications configured to be Universal navigation extensions also require 96 x 96 and 48 x 48 pixel icons. *(assets/icon{32,128}.png)*


## Text
The text in your Marketplace listing describes your application to potential users. The following text assets are required to build the G Suite Marketplace listing for your application:

- [x] Application name. The name of the application shown in the listing; this should match the Product name shown to users in the OAuth consent screen. Limit this string to 15 characters or less to ensure it displays well in the G Suite Marketplace listing. Do not use the word "Google" or other Google product names. *("College Scorecard")*

- [x] Short application description. A short summary of what your application does. Limit this to 200 characters or less.

    ````
    Easily view quick facts about colleges while opening their admissions emails.
    ````

- [x] Detailed application description. A longer description of what your application can do for the user. It is presented in the Overview section of the G Suite Marketplace listing, under the screenshots you provide. Limit this to less than 16,000 characters.

    ````
    The College Scorecard Add-on gives you quick information about a college right from Gmail. Just click the icon while opening college emails to easily view their scorecard information.

    FEATURES:
    + School website
    + Location (including a map and directions)
    + School details
        - Setting, ownership, and type of school
        - Average net price (including link to net price calculator)
        - Graduation rate
    + Student body details
        - Total undergraduate enrollment
        - Percent of full-time students
        - Enrollment by race/ethnicity
    + Admissions details
        - Acceptance rate
        - Middle 50% SAT
        - Middle 50% ACT
    ````

- [x] Scopes. A complete list of all the OAuth scopes the application requires. These scopes are determined by the API calls the application uses. Always use the narrowest scopes possible (for example, don't include a full Drive scope when a read-only scope is all your application needs). For Apps Script projects, see Scopes for more details.

    ````
    https://www.googleapis.com/auth/gmail.addons.execute
    https://www.googleapis.com/auth/gmail.addons.current.message.readonly
    https://www.googleapis.com/auth/script.external_request
    ````

In addition to the required text assets, you can optionally provide the following details:

- [x] Developer name. The name you want displayed as the author of the application in the listing. *("Kirpal Demian")*

- [x] Developer email. An email address that is used as point of contact for the application. This email address is not included in the G Suite Marketplace listing; rather, it is used if Google needs to contact the application developer (strongly recommended). *("demian@kirp.al")*


## URLs
By providing the following URLs, you create links in your Marketplace listing that allow users to learn more about your application. The following URLs are required to build the G Suite Marketplace listing for your application:

- [x] Privacy policy URL. A link to a web page that describes your application's privacy policy. This is required for verification. *(store/PRIVACY.md)*

- [x] Terms of Service URL. A URL to a web page that describes your application's terms of service. *(store/TERMS.md)*

- [x] Developer website URL. A URL to a web page that identifies you (or your organization) as the developer of the application. *(https://kirp.al)*

You can further enhance your application listing by providing the following URLs:

- [x] Application website URL. A link to a web site that describes your application. This is distinct from the above developer website URL, which is a page that describes you or your organization. *(https://github.com/kirpal/gmail-college-scorecard)*

- [ ] YouTube video URL. A link to a YouTube video that describes your application and shows it in action.

- [ ] Setup URL. A link to a web page that describes how to set up your application after it is first installed. Recommended if the application requires configuration that is hard to explain well within the application itself.

- [ ] Admin config URL. A link to a web page that tells domain administrators how to configure the application for use by their users. Unnecessary unless the application requires a domain-level configuration.

- [x] Support URL. A link to a web page that describes how your users can get support from you if they are having issues with the application. Recommended. *(https://github.com/kirpal/gmail-college-scorecard/issues)*

- [ ] Deletion policy URL. A link to a web page that describes how and when your application deletes user data. Strongly recommended if the application collects and stores user data.

- [ ] Product logo URL. A link to a hosted image logo to display on the application's OAuth consent screen. The image should be no larger than 120 x 120 pixels.
