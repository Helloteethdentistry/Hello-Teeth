/**
 * Hello Teeth — one-time inquiry form setup.
 *
 * 1. Open https://script.google.com/home/start in the clinic's Google account.
 * 2. Replace Code.gs with this entire file and save the project.
 * 3. Select createHelloTeethInquiryForm and click Run; review Google's permissions.
 * 4. Copy the PUBLIC FORM URL from the execution log into clinic-config.js.
 *
 * This creates a Google Form and a linked response spreadsheet in your account.
 * Running it again in the SAME Apps Script project reuses those files.
 * It never deletes responses, shares the spreadsheet, or sends email.
 * Reference: https://developers.google.com/apps-script/reference/forms/form
 */
function createHelloTeethInquiryForm() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const properties = PropertiesService.getScriptProperties();
    const formKey = 'HELLO_TEETH_FORM_ID';
    const sheetKey = 'HELLO_TEETH_SHEET_ID';
    const completeKey = 'HELLO_TEETH_SETUP_COMPLETE';
    const savedFormId = properties.getProperty(formKey);
    let form;

    if (savedFormId) {
      try {
        form = FormApp.openById(savedFormId);
      } catch (error) {
        throw new Error(
          'The saved clinic form could not be opened. Restore it from Google ' +
          'Drive Trash or restore this account\'s access, then run again. ' +
          'No replacement form has been created. Saved ID: ' + savedFormId
        );
      }
    } else {
      // Keep a new form unpublished until its questions and response sheet exist.
      form = FormApp.create('Hello Teeth | Patient Inquiry', false);
      properties.setProperty(formKey, form.getId());
    }

    // Prefer a destination selected in Google Forms over a previously saved ID.
    const destinationId = form.getDestinationId();
    const savedSheetId = destinationId || properties.getProperty(sheetKey);
    let sheet;

    if (savedSheetId) {
      try {
        sheet = SpreadsheetApp.openById(savedSheetId);
      } catch (error) {
        throw new Error(
          'The clinic response spreadsheet could not be opened. Restore it ' +
          'from Google Drive Trash or restore access, then run again. ' +
          'No responses have been changed. Saved ID: ' + savedSheetId
        );
      }
    } else {
      sheet = SpreadsheetApp.create('Hello Teeth | Patient Inquiries');
      properties.setProperty(sheetKey, sheet.getId());
    }

    if (!destinationId) {
      form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
    }
    properties.setProperty(sheetKey, sheet.getId());

    if (properties.getProperty(completeKey) === 'true') {
      // Preserve any later edits and any decision to close the existing form.
      logHelloTeethLinks_(form, sheet);
      console.log('Existing setup reused. No duplicate form or spreadsheet created.');
      return;
    }

    form.setDescription(
      'Your Smile Our Efforts\n\n' +
      'Welcome to Hello Teeth. Tell us how to contact you and what you ' +
      'would like to ask about. We welcome inquiries from India and overseas.\n\n' +
      'Please share only basic contact details and a general inquiry. Do not ' +
      'include medical records, diagnoses, identification documents, or payment ' +
      'information. This form is for inquiries, not urgent care or confirmed bookings.\n\n' +
      'Your answers are stored in Google Forms and a linked Google Sheet for ' +
      'the clinic to review and respond to this inquiry.'
    );
    form.setCollectEmail(false);
    form.setLimitOneResponsePerUser(false);
    form.setPublishingSummary(false);
    form.setAllowResponseEdits(false);
    form.setShowLinkToRespondAgain(false);
    form.setShuffleQuestions(false);
    form.setIsQuiz(false);
    form.setConfirmationMessage(
      'Thank you for getting in touch with Hello Teeth. Your inquiry has ' +
      'been received. The clinic can use your contact details to discuss the ' +
      'next step. This is an inquiry acknowledgment; an appointment is ' +
      'confirmed only when arranged with the clinic.'
    );
    form.setCustomClosedFormMessage(
      'Hello Teeth inquiry form is currently unavailable. Please check ' +
      'the clinic website for contact information.'
    );

    // Existing titles are reused if an earlier run stopped partway through.
    const titles = new Set(form.getItems().map(function (item) {
      return item.getTitle();
    }));
    function addOnce(title, createItem) {
      if (!titles.has(title)) {
        createItem().setTitle(title);
        titles.add(title);
      }
    }

    addOnce('Full name', function () {
      return form.addTextItem().setRequired(true).setValidation(
        FormApp.createTextValidation()
          .requireTextMatchesPattern('.*\\S.*')
          .setHelpText('Please enter your name.')
          .build()
      );
    });
    addOnce('Email address', function () {
      return form.addTextItem().setRequired(true)
        .setHelpText('Use an email address where the clinic can reach you.')
        .setValidation(FormApp.createTextValidation()
          .requireTextIsEmail()
          .setHelpText('Please enter a valid email address, for example name@example.com.')
          .build());
    });
    addOnce('Phone number (optional)', function () {
      return form.addTextItem().setRequired(false).setHelpText(
        'Include your country code, for example +91, +1, +44, or +49. ' +
        'Please provide a number if you prefer a phone call.'
      );
    });
    addOnce('Country of residence', function () {
      return form.addMultipleChoiceItem().setRequired(true)
        .setChoiceValues(['India', 'United States', 'United Kingdom', 'Germany'])
        .showOtherOption(true);
    });
    addOnce('What would you like to inquire about?', function () {
      return form.addMultipleChoiceItem().setRequired(true).setChoiceValues([
        'General dentistry',
        'Smile design and cosmetic dentistry',
        'Dental implants',
        'Clear aligners',
        'Restorative dentistry',
        'Planning a visit from overseas',
        'I would like guidance'
      ]).showOtherOption(true);
    });
    addOnce('Preferred way to contact you', function () {
      return form.addMultipleChoiceItem().setRequired(true)
        .setChoiceValues(['Email', 'Phone'])
        .setHelpText('If you choose Phone, please include your number above.');
    });
    addOnce('When are you considering a visit? (optional)', function () {
      return form.addMultipleChoiceItem().setRequired(false).setChoiceValues([
        'Within the next month',
        'In 1–3 months',
        'Later this year',
        'I am exploring my options'
      ]);
    });
    addOnce('A short message (optional)', function () {
      return form.addParagraphTextItem().setRequired(false)
        .setHelpText(
          'Up to 500 characters. Share a general question or your time zone and ' +
          'a convenient time to contact you. Do not include medical history, ' +
          'documents, or payment information.'
        )
        .setValidation(FormApp.createParagraphTextValidation()
          .requireTextLengthLessThanOrEqualTo(500)
          .setHelpText('Please keep your message to 500 characters or fewer.')
          .build());
    });
    addOnce('Permission to contact you', function () {
      return form.addCheckboxItem().setRequired(true).setChoiceValues([
        'I agree that Hello Teeth may use my details to contact me about ' +
        'this inquiry. I understand that submitting this form does not book an appointment.'
      ]);
    });

    if (form.supportsAdvancedResponderPermissions()) {
      form.setPublished(true);
    }
    form.setAcceptingResponses(true);
    properties.setProperty(completeKey, 'true');
    logHelloTeethLinks_(form, sheet);
    console.log(
      'Before adding the public URL to your website, open it in a private ' +
      'browser window and send a test inquiry. In Google Forms, check that ' +
      'responder access is Anyone with the link. Google Workspace policies ' +
      'may require your administrator to allow external responders.'
    );
  } finally {
    lock.releaseLock();
  }
}

function logHelloTeethLinks_(form, sheet) {
  console.log('PUBLIC FORM URL (use this on the website): ' + form.getPublishedUrl());
  console.log('FORM EDITOR (clinic owner only): ' + form.getEditUrl());
  console.log('PATIENT INQUIRIES SHEET (clinic owner only): ' + sheet.getUrl());
  console.log('In clinic-config.js, set googleFormUrl to the PUBLIC FORM URL above.');
}
