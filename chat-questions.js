(function(root){const groups=[
  {
    "name": "Getting started",
    "questions": [
      "What dental services do you provide?",
      "I have a dental problem. Can you help me?",
      "I want to book an appointment.",
      "Where is Hello Teeth Dental Clinic located?",
      "What are your clinic timings?",
      "Is the clinic open today?",
      "Can I speak with the receptionist?",
      "Is emergency dental treatment available?"
    ]
  },
  {
    "name": "Appointments",
    "questions": [
      "How can I book an appointment?",
      "Can I book an appointment for today?",
      "What appointment slots are available?",
      "Can I book an appointment for someone else?",
      "How can I reschedule my appointment?",
      "How can I cancel my appointment?",
      "Do you accept walk-in patients?",
      "How early should I arrive?",
      "What documents should I bring?",
      "Can you remind me about my appointment?",
      "Is an online consultation available?",
      "Can I book through WhatsApp or phone?"
    ]
  },
  {
    "name": "Dental emergencies",
    "questions": [
      "I have severe tooth pain. What should I do?",
      "My face or gums are swollen.",
      "My tooth is bleeding.",
      "My tooth has broken.",
      "My tooth has been knocked out.",
      "My filling has come out.",
      "My dental crown has fallen off.",
      "My wisdom tooth is painful.",
      "I have bleeding after tooth extraction.",
      "I cannot open my mouth properly.",
      "I have an infection or pus near my tooth.",
      "Something is stuck between my teeth.",
      "My child has injured a tooth.",
      "Do I need an emergency appointment?",
      "Is an emergency dentist available right now?"
    ]
  },
  {
    "name": "Dental symptoms",
    "questions": [
      "Why does my tooth hurt?",
      "Why are my gums bleeding?",
      "Why do I have bad breath?",
      "Why are my teeth sensitive?",
      "Why are my teeth becoming yellow?",
      "Why do my gums hurt?",
      "Why is my tooth loose?",
      "Why do I have mouth ulcers?",
      "What causes cavities?",
      "How can I know if I have a dental infection?",
      "Why does my jaw make a clicking sound?",
      "Why does my jaw hurt?",
      "Why do my teeth hurt while eating?",
      "Why do I have gaps between my teeth?",
      "Why are my gums receding?"
    ]
  },
  {
    "name": "Check-ups & cleaning",
    "questions": [
      "Do you provide complete dental check-ups?",
      "How often should I get a dental check-up?",
      "Do you provide teeth cleaning and scaling?",
      "Is teeth cleaning painful?",
      "How much does teeth cleaning cost?",
      "How long does teeth cleaning take?",
      "Can scaling damage my teeth?",
      "Does cleaning remove yellow stains?",
      "Do you provide teeth polishing?",
      "Do you treat bad breath?",
      "Can I eat after teeth cleaning?",
      "How often should scaling be done?"
    ]
  },
  {
    "name": "Fillings",
    "questions": [
      "Do you treat dental cavities?",
      "How can I know if I have a cavity?",
      "Do you provide tooth-coloured fillings?",
      "Is a dental filling painful?",
      "How much does a tooth filling cost?",
      "How long does a filling procedure take?",
      "How long does a dental filling last?",
      "Can a badly damaged tooth be filled?",
      "Can I eat immediately after a filling?",
      "What should I do if my filling comes out?"
    ]
  },
  {
    "name": "Root canals",
    "questions": [
      "Do I need root canal treatment?",
      "What is root canal treatment?",
      "Is root canal treatment painful?",
      "How much does a root canal cost?",
      "How many visits are needed?",
      "How long does the procedure take?",
      "Is a crown necessary after a root canal?",
      "Can a root canal save my tooth?",
      "What can I eat after treatment?",
      "Why does my tooth hurt after a root canal?",
      "How long does a root-canal-treated tooth last?",
      "Can root canal treatment be completed in one sitting?"
    ]
  },
  {
    "name": "Extraction & wisdom teeth",
    "questions": [
      "Do you provide tooth extraction?",
      "Is tooth extraction painful?",
      "How much does tooth extraction cost?",
      "When does a tooth need to be removed?",
      "Do you remove wisdom teeth?",
      "Does every wisdom tooth need removal?",
      "How long does wisdom tooth removal take?",
      "What should I eat after extraction?",
      "How long does recovery take?",
      "When can I brush after extraction?",
      "Is bleeding normal after extraction?",
      "Can I smoke or drink alcohol after extraction?",
      "What should I do if pain increases after extraction?"
    ]
  },
  {
    "name": "Crowns & bridges",
    "questions": [
      "Do you provide dental crowns?",
      "Which type of crown is best?",
      "What is the difference between metal, ceramic and zirconia crowns?",
      "How much does a dental crown cost?",
      "How long does a crown last?",
      "How many visits are required?",
      "What is a dental bridge?",
      "Can a bridge replace a missing tooth?",
      "Is crown placement painful?",
      "What should I do if my crown becomes loose?",
      "Can a broken crown be repaired?",
      "How should I care for my crown or bridge?"
    ]
  },
  {
    "name": "Implants & dentures",
    "questions": [
      "Do you provide dental implants?",
      "What is a dental implant?",
      "Am I eligible for a dental implant?",
      "Is implant surgery painful?",
      "How much does a dental implant cost?",
      "How long does implant treatment take?",
      "How long do implants last?",
      "Can an implant replace one missing tooth?",
      "Can implants replace all missing teeth?",
      "What is the difference between an implant and a bridge?",
      "Are implants safe for senior citizens?",
      "Can diabetic patients get dental implants?",
      "What precautions are needed after implant surgery?",
      "Do you provide dentures?",
      "What is the cost of removable or fixed teeth?"
    ]
  },
  {
    "name": "Braces & aligners",
    "questions": [
      "Do you provide braces treatment?",
      "Do I need braces?",
      "What types of braces are available?",
      "Do you offer metal braces?",
      "Do you offer ceramic braces?",
      "Do you provide invisible aligners?",
      "What is the cost of braces?",
      "What is the cost of clear aligners?",
      "How long does orthodontic treatment take?",
      "Are braces painful?",
      "Can adults get braces?",
      "How often will I need follow-up visits?",
      "What foods should I avoid with braces?",
      "What should I do if a bracket or wire breaks?",
      "Are retainers necessary after braces?"
    ]
  },
  {
    "name": "Cosmetic dentistry",
    "questions": [
      "Do you provide teeth whitening?",
      "How much does teeth whitening cost?",
      "Is teeth whitening safe?",
      "How long do whitening results last?",
      "Can yellow teeth become white?",
      "Do you provide smile designing?",
      "What is a smile makeover?",
      "Do you provide veneers?",
      "Can you repair chipped or broken teeth?",
      "Can gaps between teeth be closed?",
      "Can you improve the shape of my teeth?",
      "Can you remove stains caused by tobacco, tea or coffee?"
    ]
  },
  {
    "name": "Gum care",
    "questions": [
      "Do you treat bleeding gums?",
      "Why do my gums bleed while brushing?",
      "Do you treat gum infections?",
      "What is gum disease?",
      "Can loose teeth be saved?",
      "How much does gum treatment cost?",
      "Do I need deep cleaning?",
      "Is gum treatment painful?",
      "How can I prevent gum disease?",
      "Why are my gums swollen?",
      "Can receding gums be treated?",
      "Can gum disease cause tooth loss?"
    ]
  },
  {
    "name": "Children’s dentistry",
    "questions": [
      "Do you treat children?",
      "At what age should my child first visit a dentist?",
      "My child has tooth pain. What should I do?",
      "Do milk teeth need treatment?",
      "Do you provide fillings for children?",
      "Do you perform root canal treatment for milk teeth?",
      "Do you provide fluoride treatment?",
      "What are dental sealants?",
      "My child is afraid of the dentist. Can you help?",
      "What should I do if my child breaks a tooth?",
      "When should my child start brushing?",
      "Do you provide braces consultation for children?",
      "How can I prevent cavities in my child’s teeth?"
    ]
  },
  {
    "name": "Costs & payments",
    "questions": [
      "What is your consultation fee?",
      "How much will my treatment cost?",
      "Can you provide an estimated price?",
      "Are X-rays included in the consultation fee?",
      "What payment methods do you accept?",
      "Do you accept UPI, cards or cash?",
      "Is EMI available for expensive treatment?",
      "Do you accept dental insurance?",
      "Can I get a treatment estimate in writing?",
      "Are follow-up visits chargeable?",
      "Are there any current offers or dental packages?",
      "Do you provide a bill or payment receipt?"
    ]
  },
  {
    "name": "Clinic information",
    "questions": [
      "What is the complete clinic address?",
      "Can you share the Google Maps location?",
      "Is parking available?",
      "What are the clinic’s working hours?",
      "Is the clinic open on Sunday?",
      "Is the clinic open on public holidays?",
      "What is the clinic’s phone number?",
      "What is the clinic’s WhatsApp number?",
      "Which areas of Lucknow do you serve?",
      "Is the clinic wheelchair accessible?",
      "Which languages does the dentist speak?",
      "Can I see the dentist’s qualifications?",
      "Can I read patient reviews?",
      "What safety and sterilisation measures do you follow?"
    ]
  },
  {
    "name": "Before & after treatment",
    "questions": [
      "Can I eat before my dental appointment?",
      "Should I take my regular medicines?",
      "Should I inform the dentist about allergies?",
      "Can I receive treatment during pregnancy?",
      "Can diabetic or heart patients receive dental treatment?",
      "Should I stop blood-thinning medicines?",
      "Can I drive after treatment?",
      "How long will the numbness last?",
      "What should I eat after treatment?",
      "When can I brush after treatment?",
      "Is pain after treatment normal?",
      "When should I return for a follow-up?",
      "What should I do if swelling or pain increases?"
    ]
  }
];if(typeof module==="object"&&module.exports)module.exports=groups;else root.DentalQuestions=groups;})(typeof globalThis!=="undefined"?globalThis:this);
