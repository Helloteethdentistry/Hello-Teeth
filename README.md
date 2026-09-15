# Hello Teeth

A responsive, frontend-only dental clinic website built with HTML, CSS, and vanilla JavaScript. No npm install, build process, database, or website backend is needed.

## Website pages

Home (`index.html`), About (`about.html`), Treatments (`treatments.html`), International Patients (`international.html`), Blogs (`blogs.html`), FAQs (`faqs.html`), and Contact & Inquiries (`contact.html`) are separate source files. Each treatment has its own `care-*.html` detail file. On GitHub Pages, Jekyll permalinks expose these pages through clean public URLs such as `/about`, `/treatments`, and `/blogs`. This copy lives in `Project/Hello Teeth`; open its `index.html` to see the redesign.

## Reference design

The redesign follows the [supplied Hello Teeth website](https://darkblue-cattle-122510.hostingersite.com/elementor-151/): teal, mint and gold colours, Inter typography, a dentist portrait hero, a rounded service panel and spacious photo sections. `reference-theme.css` styles all public pages; `home-reference.css` handles the homepage, `about-profile.css` handles the dentist profile, and `blog.css` handles the dental guides. These styles load after the original shared styles.

The dentist name (Dr. Shivani Singh), role (Dental Surgeon), and phone (+91 6386359307) come from that reference. The clinic hours are configured as open 24 hours a day, 7 days a week, following the owner's latest instruction. Image sources are listed in `assets/IMAGE-NOTES.md`. Appointment buttons lead to the single Google Form inquiry on the Contact page; the clinic confirms appointments separately.

Professional details were taken from the supplied `Hello-Teeth-Dental-Clinic.pptx`: BDS with Endodontic Certification, practice since 2012, 10+ years of experience, and Indian Dental Association membership. The presentation also lists a Best Dental Surgeon award in 2023 and a Best Dental Care nomination in 2022; it does not identify the issuing organisations, institutions, or graduation years, so the website does not add them. No patient reviews or before/after results have been invented.

The clinic address is configured as 1/346, Virat Khand, Gomti Nagar, near Sani Temple or Samudaik Kendra (LDA Office), Lucknow, Uttar Pradesh 226010, India.

## Open the website

Open `index.html` in a browser, use your editor's Live Server, or run this command from this project folder:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`. Publish the whole folder to a static hosting service when ready.

## Connect the patient inquiry form

The Google Form setup is prepared in **`setup/index.html`**. Open that page and follow the one-time Google Apps Script instructions to create the form and response spreadsheet in your own clinic Google account. Running the setup requires your Google account because the form and patient responses must belong to you.

After setup, copy the **published responder URL** into `clinic-config.js`:

```javascript
googleFormUrl: "https://docs.google.com/forms/d/e/YOUR_PUBLISHED_FORM_ID/viewform",
```

Use the real generated URL in place of this example. The website embeds that form automatically and offers a separate link if the embed cannot load. A `https://forms.gle/...` short link works as a separate link only; use the long responder URL for an embedded form. Do not paste the editor URL, an iframe HTML snippet, or the spreadsheet URL.

Until a valid form URL is configured, the website displays “Our Google Form is being connected.” It has no dummy submission or local patient-data storage. Configuring a URL cannot verify whether Google has published the form or granted responder access: check the live form yourself before launch.

### If you prefer to create the form manually

1. Create a blank form in [Google Forms](https://forms.google.com/) named **Hello Teeth — Patient Inquiry**.
2. Add name, email, country, treatment interest, and preferred contact method. An optional phone/WhatsApp field should request the international country code. Keep initial inquiries brief and leave medical records and sensitive health history out of this form.
3. Use manual email entry if you want visitors without Google accounts to inquire. Google offers this under **Settings → Responses → Collect email addresses → Responder input**. [Google: manage form responses](https://support.google.com/docs/answer/139706?hl=en).
4. Publish the form and allow the intended responders, including international visitors. Select general access for anyone with the link where available. Avoid a one-response limit when you do not want Google sign-in, and keep response summaries disabled to avoid exposing other inquiries. Copy the responder link after publishing. Google's embed option is under **More → Embed HTML**. [Google: publish and share forms](https://support.google.com/docs/answer/2839588?hl=en).
5. Open **Responses → Link to Sheets** to track inquiries. You can also use **Responses → Summary → More → Select destination for responses** to choose a new or existing spreadsheet. Keep that spreadsheet private to authorized clinic staff. [Google: response storage](https://support.google.com/docs/answer/2917686?hl=en), [Google: view responses](https://support.google.com/docs/answer/139706?hl=en).
6. Paste the published responder link into `clinic-config.js`. Test in a private browser window while signed out: send a test inquiry and confirm it appears in the response spreadsheet. Remove your test response when finished.

Google Forms hosts the form and stores submitted information in your Google account and linked Google Sheet. The static website does not process or store those responses. Google controls its own form appearance, submission confirmation, and sign-in behavior. Put your clinic's contact and privacy information in the form before collecting inquiries.

## Add your clinic details

Edit the public values in `clinic-config.js`:

| Setting | Value |
| --- | --- |
| `googleFormUrl` | Published Google Form responder link |
| `phone` | Clinic phone, including country code |
| `whatsappNumber` | WhatsApp number with country code, digits only |
| `email` | Public clinic email address |
| `address` | Clinic's real street address, city, and country |
| `dentistName` | Dentist's real name, if displayed in the page |

Empty phone, email, and WhatsApp values keep those contact links hidden. The address shows a location placeholder until configured. These values are public: never put credentials or patient information in this file.

Before publishing, confirm the clinic's offered services and replace any location placeholders. Add only verified credentials or other factual clinic information. The website does not invent patient reviews, ratings, prices, or dentist qualifications.

## Files and behavior

- `index.html`: page content and accessible structure.
- `blogs.html` and `blog.css`: the clickable blog index and responsive card layout.
- `blog-*.html` and `blog-post.css`: eight individual dental guide pages with full articles and consultation guidance.
- `style.css`: responsive styling and reduced-motion support.
- `script.js`: mobile navigation, page transitions, treatment dialogs, scroll effects, and Google Form connection.
- `clinic-config.js`: public clinic contact and form settings.
- `assets/`: website images and clinic branding.
- `setup/index.html`: instructions and the prepared Google Form creation helper.

The page works without JavaScript for reading content and navigating its sections. JavaScript enables treatment dialogs and the configured contact/form integration. An internet connection is required for the Google Form and externally hosted resources.

The redesigned hero uses `assets/dentist-portrait.png` from the supplied reference website. The previous `assets/hero-smile.png` is a retained AI-generated illustrative portrait and is no longer displayed. The Hello Teeth logo is a high-resolution recreation of the previously supplied reference. See `assets/IMAGE-NOTES.md` for asset details.

## Dental conversation guide

The reply logic is in `dental-guide.js`, loaded before `chatbot.js` on every page. It recognises singular/plural topics and common spelling variants, provides explanations for specific dental topics, and keeps page-local context for cost, duration, discomfort, and care follow-ups. Unclear questions prompt clarification. “Explore treatments” lists services directly; it does not redirect to inquiries. Prices and opening times are not invented.

Run the conversation regression checks with `node --test tests/dental-guide.test.cjs` from this project folder. The checks cover the treatment-menu bug, suggested replies, contextual follow-ups, symptom negation, urgent concerns, and medication boundaries. Clinic staff should review the content periodically.

`chatbot.js` and `chatbot.css` provide a browser-only, rule-based dental guide on all website pages. The floating Smile help button opens it. It is not a generative AI model or live staff chat. No API keys or backend are needed. Messages remain in page memory (maximum 60 visible bubbles), are cleared on refresh or Clear chat, and are not submitted to the clinic or saved in browser storage. The Google Form is the separate way to send an inquiry. The guide covers common questions and treatment navigation, includes urgent symptom guidance, and avoids diagnoses or medication instructions. It does not replace a dental assessment.

### Clinic question series

The supplied question series is available in `chat-questions.js`: 215 patient questions across 17 categories. The nine proposed personal-detail prompts are deliberately handled through the connected Google Form rather than a chat flow with no submission endpoint. `dental-conversations.js` adds guided symptom follow-ups and clinic-policy answers. Live slots, reminders, cancellation, staff transfer, payment methods and treatment prices are not claimed without a clinic integration or verified details. The chat can open the inquiry page, but it cannot confirm submission or booking. Common questions can be selected from the accessible question browser. Two consecutive unrecognised questions offer an honest clinic-contact option. Conversations remain in page memory only.
