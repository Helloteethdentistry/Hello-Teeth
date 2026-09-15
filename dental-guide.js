/* Local dental information. No network calls or patient storage. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DentalGuide = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const topics = {
    root: {title:'root canal treatment', pattern:/\b(root\s*canals?|rct|endodont\w*)\b/, page:'care-restorative',
      overview:'Root canal treatment removes infected tissue from inside a tooth. The dentist cleans and fills the root canals, then seals the tooth; a crown may also be needed. It aims to keep a tooth that might otherwise need removal. An examination is needed to decide if it is appropriate.',
      duration:'Root canal treatment may involve more than one appointment. The tooth involved, infection, and final restoration affect the plan. Ask whether the estimate includes a filling or crown and any further visits.',
      discomfort:'A dentist usually uses local anaesthetic for root canal treatment. Tell them if you feel discomfort during the procedure. Soreness can happen afterward; contact the treating dentist if symptoms worsen or swelling develops.',
      care:'Follow the treating dentist’s instructions and complete any planned final restoration. Ask when you can chew on that tooth and when to return for review.'},
    implants:{title:'dental implants',pattern:/\b(implants?|missing (tooth|teeth)|replace (a )?tooth)\b/,page:'care-implants',
      overview:'A dental implant replaces a tooth root and supports a replacement tooth. A dentist checks your mouth and suitability before planning treatment. It is different from a bridge or a removable denture.',
      duration:'Implant treatment is planned in stages, so the surgical visit and finished replacement tooth may be separate. Healing and any additional procedures affect the timeline. Request a written schedule before making travel plans.',
      discomfort:'Ask the treating dentist how they will manage comfort during the procedure and what recovery to expect. No chat can promise a pain-free procedure or predict your recovery.',
      care:'Ask for a cleaning routine and follow-up schedule for your implant. Ongoing dental care matters after the replacement tooth is fitted.'},
    aligners:{title:'clear aligners',pattern:/\b(aligners?|invisalign)\b/,page:'care-aligners',
      overview:'Clear aligners are removable orthodontic appliances used to move teeth. They are not suitable for every alignment problem. A dentist or orthodontist assesses your teeth and bite before recommending aligners or another option.',
      duration:'The duration and daily wearing schedule depend on your orthodontic plan. Ask about review visits and retainers before starting. I cannot estimate your personal timeline from a message.',
      discomfort:'Ask your dentist what pressure or soreness to expect as teeth move, and what to do if an aligner irritates your mouth. Severe or persistent pain needs a clinical review.',
      care:'Follow the prescribed wearing and cleaning instructions. Ask about meals, oral hygiene, review appointments, and retainers after treatment.'},
    braces:{title:'braces',pattern:/\b(braces?|orthodont\w*|crooked|straighten|straight teeth)\b/,page:'care-aligners',
      overview:'Braces move teeth to improve alignment and how the teeth meet. Some appliances are fixed and others are removable. A dentist or orthodontist checks your bite and recommends a suitable approach.',
      duration:'Braces usually need ongoing review appointments; the full duration varies with the bite and the planned movement. Ask your orthodontist about the expected timeline and retainers afterward.',
      discomfort:'Ask about expected discomfort after fitting or adjustments. If a wire is hurting you, or pain is severe or persistent, contact the treating dental team.',
      care:'Clean carefully around braces and follow your orthodontist’s food and hygiene instructions. Keep scheduled reviews and ask what to do if a bracket or wire becomes loose.'},
    whitening:{title:'teeth whitening',pattern:/\b(whiten\w*|yellow\w*|stain\w*|bleach\w*|white teeth|peele|peelay)\b/,page:'care-cosmetic',
      overview:'Professional whitening lightens the colour of natural teeth. A dentist should first check the cause of discolouration and whether whitening is suitable. Fillings, crowns, and veneers do not whiten in the same way as natural teeth.',
      duration:'The schedule depends on whether the dentist recommends treatment in the clinic or a supervised home system. Ask about the course, maintenance, and likely results for your teeth.',
      discomfort:'Whitening can cause sensitivity. Tell your dentist about existing sensitivity before treatment, and contact them if treatment causes discomfort. Avoid unverified whitening products or DIY bleaching.',
      care:'Use only the method and schedule recommended by your dental professional. Ask about sensitivity, maintenance, and the effect on existing dental restorations.'},
    crowns:{title:'dental crowns',pattern:/\b(crowns?|tooth cap|caps for teeth)\b/,page:'care-restorative',
      overview:'A crown is a cover fitted over a tooth to restore its shape or strength. A dentist assesses the tooth before deciding whether a crown, filling, or another treatment is appropriate.'},
    fillings:{title:'fillings and tooth decay',pattern:/\b(fillings?|cavit\w*|decay|hole in (my |a |the )?(tooth|teeth))\b/,page:'care-restorative',
      overview:'A filling repairs a damaged area of a tooth. The depth and extent of decay affect the treatment needed. A dentist must examine the tooth; pain alone cannot tell whether a filling or a different treatment is necessary.'},
    veneers:{title:'veneers and smile makeovers',pattern:/\b(veneers?|smile makeover|cosmetic|smile design)\b/,page:'care-cosmetic',
      overview:'Veneers cover the front surface of teeth to change their appearance. They are different from whitening or braces. Discuss the preparation involved, alternatives, maintenance, and your goals before deciding.'},
    children:{title:'children’s dental care',pattern:/\b(child\w*|kid\w*|bab(?:y|ies)|toddler\w*|milk teeth|bach\w*)\b/,page:'care-children',
      overview:'Children’s care includes checking developing teeth, brushing guidance, and helping children feel comfortable at visits. Start cleaning teeth when they appear and ask a dentist for age-appropriate toothpaste and brushing guidance. Is your question about routine care or a particular symptom?'},
    hygiene:{title:'daily brushing and cleaning',pattern:/\b(brush\w*|floss\w*|toothpaste|mouthwash|hygiene|daily care|clean\w*|scaling|tartar|plaque)\b/,page:'care-general',
      overview:'Brush for about two minutes twice a day with fluoride toothpaste, including before bed. Spit out afterward rather than rinsing straight away. Clean between teeth with floss or an appropriate interdental brush. Professional cleaning removes deposits that home brushing cannot remove.',
      duration:'Brush for about two minutes each time, twice a day. Your dentist can recommend how often you need professional cleaning based on your gums and teeth.'},
    gums:{title:'bleeding or sore gums',pattern:/\b(gums?|gingivit\w*|periodont\w*|masood\w*)\b/,page:'care-general',
      overview:'Bleeding, red, or sore gums can occur with gum disease and should be checked by a dentist. Keep cleaning gently rather than stopping altogether. Very swollen or painful gums, or loose adult teeth, need prompt assessment.'},
    breath:{title:'bad breath',pattern:/\b(bad breath|halitosis|mouth (smell|odou?r)|smelly breath|badbu)\b/,page:'care-general',
      overview:'Persistent bad breath can be linked to oral hygiene or dental and gum problems. Clean teeth and between them regularly, and gently clean your tongue. If it persists despite cleaning, arrange a dental check rather than only masking it with mouthwash.'},
    sensitivity:{title:'tooth sensitivity',pattern:/\b(sensitiv\w*|cold (water|drink)|hot (water|drink)|thanda|garam)\b/,page:'care-general',
      overview:'Sensitivity to hot, cold, or sweet foods can have different causes, so I cannot identify the cause here. Avoid triggers while arranging a dental assessment, particularly if pain lingers, affects one tooth, or occurs when biting. Does the discomfort go away quickly, or keep aching?'},
    pain:{title:'tooth pain',pattern:/\b(toothache|tooth ache|pain|painful|hurt\w*|aching|ache|dard|dukh\w*)\b/,page:'care-general',
      overview:'Toothache can have several causes and needs a dental assessment. Arrange a visit if it lasts more than two days, affects daily activities, or occurs with pain when biting. Choose soft foods and avoid food or drinks that trigger pain while arranging care. How long has it been hurting?',
      care:'Until you can see a dentist, choose soft foods and avoid things that trigger pain. Ask a pharmacist about suitable pain relief rather than choosing medication from chat. Worsening pain, fever, or swelling needs urgent dental advice.'}
  };
  const defaults = ['Tooth pain', 'Brushing tips', 'What is a root canal?', 'Clinic details'];
  const contact = ['Contact the clinic', 'contact'];
  function normalize(raw) {
    return raw.toLowerCase().normalize('NFKC').replace(/[’']/g,'').replace(/\bcan not\b/g,'cannot')
      .replace(/\b(teath|teet|teeh)\b/g,'teeth').replace(/\b(tooh|toot)\b/g,'tooth')
      .replace(/\b(rootcanal|root canel|root cannal)\b/g,'root canal').replace(/\b(treaments?|tretments?)\b/g,'treatments')
      .replace(/\b(implent|implante|implamt)\b/g,'implant').replace(/\b(whitning|whittening)\b/g,'whitening')
      .replace(/\b(dant|daant|दांत|दाँत)\b/g,'tooth').replace(/दर्द/g,' pain ')
      .replace(/सूजन/g,' swelling ').replace(/सांस/g,' breathing ').replace(/नहीं/g,' nahi ')
      .replace(/\s+/g,' ').trim();
  }
  // Remove explicit negative symptom phrases without dropping subsequent symptoms.
  function positiveSymptoms(q) {
    return q.replace(/\b(no|without|not having|dont have|do not have)\s+(any\s+)?(fever|swelling|pain|bleeding|difficulty breathing|trouble breathing|difficulty swallowing)\b/g,' ')
      .replace(/\b(not|isnt|is not)\s+(swollen|bleeding|painful)\b/g,' ')
      .replace(/\bno (difficulty|trouble|problems?) (in |with )?(breathing|swallowing|speaking)\b/g,' ');
  }
  function create(config = {}) {
    let current = null;
    let pending = null;
    function reply(message, key = null, choices = defaults, extra = [], intent = 'information') {
      const links = key ? [[`Read about ${topics[key].title}`,topics[key].page]] : [];
      return {message, links:[...links,...extra], choices, topic:current, intent};
    }
    function reset() { current = null; pending = null; }
    function answer(raw) {
      const q = normalize(String(raw).slice(0,600));
      if (!q) return reply('What would you like to know about your teeth?');
      if (/^(start over|new topic|reset|clear chat)[.!?]*$/.test(q)) {reset();return reply('Let’s start again. What would you like to know?');}
      const symptom = positiveSymptoms(q);
      const breathing = /(cant|cannot|unable to|difficulty|difficult|trouble|hard|struggling).{0,24}(breath|swallow|speak)|(?:breath\w*|swallow\w*).{0,20}(difficult|hard|problem|nahi)|saans.{0,20}(nahi|dikkat)|choking/.test(symptom);
      const emergency = breathing || /(?:swollen|swelling).{0,30}(?:eye|neck|throat)|(?:eye|neck|throat).{0,30}(?:swollen|swelling)|uncontrolled bleeding|bleeding.{0,20}(?:wont|doesnt|not|cannot|cant) stop/.test(symptom);
      if (emergency) {
        pending=null;
        return reply('If this is happening now, seek emergency medical care now: difficulty breathing, swallowing, or speaking; swelling around the eye or neck; or bleeding that will not stop. Contact local emergency services or go to the nearest emergency department. Do not wait for a website message.',null,['Clinic details','Start over'],[],'emergency');
      }
      if (/\b(knocked out|knocked-out|tooth fell out|adult tooth came out|injury|trauma|pus|abscess|fever|swollen|swelling)\b/.test(symptom) && !/^(what is|what are|explain)\b/.test(q)) {
        current='pain';pending=null;
        return reply('Please seek urgent dental assessment for swelling, fever with dental symptoms, pus, or an injured or knocked-out tooth. The cause cannot be established in chat. If you also have difficulty breathing or swallowing, or swelling around the eye or neck, get emergency medical care. Do not wait for the inquiry form.',null,['Clinic details','Start over'],[],'urgent');
      }
      if (/\b(antibiotic\w*|medicin\w*|medication\w*|dose|dosage|prescri\w*|painkill\w*|amoxicillin|ibuprofen|paracetamol|dawai|dawa)\b/.test(q)) return reply('I cannot choose a medicine or dose for you. The right advice depends on the cause, your age, medical conditions, allergies, and other medicines. Ask a dentist or pharmacist. If you have swelling, fever, or worsening symptoms, seek urgent dental advice.',null,['Tooth pain','Clinic details'],[contact],'medication');
      if (/\b(diagnos\w*|do i have|is it definitely)\b/.test(q)) return reply('I cannot diagnose this from a message. A dentist needs to examine your mouth and may need other checks. I can explain a dental term or help you decide where to seek assessment.',null,defaults,[contact],'diagnosis');

      // Specific topic first; broad words such as dentist, time, and where never route on their own.
      let found = Object.keys(topics).filter(key => topics[key].pattern.test(q));
      if (current && !['pain','gums','sensitivity'].includes(current) && /\b(it|this|that)\b/.test(q) && /\b(hurt\w*|painful|painless)\b/.test(q) && !/\b(my tooth|my teeth)\b/.test(q)) found=found.filter(k=>k!=='pain');
      if (found.includes('gums')) found=found.filter(k=>!['hygiene','pain'].includes(k));
      if (found.includes('sensitivity')) found=found.filter(k=>k!=='pain');
      if (found.includes('breath')) found=found.filter(k=>k!=='hygiene');
      if (found.includes('children') && found.some(k=>['pain','gums','sensitivity'].includes(k))) found=found.filter(k=>k!=='children');
      const specific=found.filter(k=>!['pain','hygiene','children'].includes(k));
      const explicit=specific[0] || found[0];
      const requestedAspect = pending;
      if (explicit) {current=explicit;pending=null;}
      const cost=/\b(cost\w*|price\w*|charg\w*|fees?|expensive|payment|kitna|kitne|kharcha|paisa)\b|how much/.test(q);
      const duration=/how long|how many (days|months|visits|sessions)|\b(duration|timeline|kitna time)\b|time.{0,16}(take|needed|required)/.test(q);
      const discomfort=/\b(hurt|hurts|painful|painless|pain free)\b|does it hurt|will it hurt|pain during/.test(q);
      const aftercare=/\b(aftercare|recovery|recover|precautions)\b|after (the |my )?(treatment|procedure)|care after|what can i do|home care|home remedy|ghar/.test(q);
      if (cost) {
        pending=null;
        return reply(`${current ? 'For '+topics[current].title+', the price' : 'The price'} depends on the assessment, recommended procedure, materials, and visits. Hello Teeth has not supplied a price list, so I cannot quote an amount. Ask for a written estimate showing what is included and any follow-up costs.`,null,['Book a visit','How long does it take?'],[contact],'cost');
      }
      if (duration || (discomfort && current && !['pain','gums','sensitivity'].includes(current)) || aftercare || (explicit && ['duration','care','discomfort'].includes(requestedAspect))) {
        const aspect=duration?'duration':aftercare?'care':discomfort?'discomfort':requestedAspect;
        if (!current) {pending=aspect;return reply('Which treatment or concern do you mean?',null,['Root canal treatment','Dental implants','Braces','Tooth pain'],[],'clarify');}
        return reply(topics[current][aspect] || `For ${topics[current].title}, ${aspect==='duration'?'the number and length of visits depend on the assessment and care plan':aspect==='care'?'follow-up care should be tailored by your treating dentist':'ask the dentist how comfort is managed and what to expect afterward'}. Ask the clinic about your individual plan.`,current,['Tell me more','Treatment costs','Book a visit'],[] ,aspect);
      }
      if (/\b(address|location|directions?|clinic details|where is (the |your )?clinic|where are you|kahan|pata)\b/.test(q)) {
        pending=null;
        return reply(config.address || 'Hello Teeth is in Virat Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010, India.',null,['Book a visit','Opening hours'],[['Get directions','https://www.google.com/maps/search/?api=1&query=1%2F346%20Virat%20Khand%20Gomti%20Nagar%20Lucknow%20226010'],contact],'location');
      }
      if (/\b(qualification|qualifications|qualified|degree|degrees|experience|ida member|dental association)\b/.test(q)) {
        const profile=[config.dentistName,config.dentistQualifications,config.dentistExperienceSince && `in practice since ${config.dentistExperienceSince}`,config.dentistMembership && `${config.dentistMembership} member`].filter(Boolean);
        return reply(profile.length ? `${profile.join(' · ')}. Read the About page for the clinic's professional profile and recognition.` : 'The clinic has not provided verified qualification details. Please ask through the inquiry form.',null,['Book a visit','Clinic details'],profile.length ? [['Professional profile','about#qualifications'],contact] : [contact],'credentials');
      }
      if (/\b(opening|hours|timings|clinic open|open today|open on|sunday|monday|saturday)\b/.test(q) || /when.*(open|close)/.test(q)) return reply(config.openingHours ? `Hello Teeth lists its opening hours as ${config.openingHours}. Please confirm your appointment with the clinic before visiting; I cannot check live availability.` : 'The clinic has not provided verified opening hours. Please confirm your date and time through the inquiry form before visiting. I cannot check live appointment availability.',null,['Book a visit','Clinic details'],[contact],'hours');
      if (/\b(phone|number|email|whatsapp)\b/.test(q)) {
        const lines=[config.phone && 'Phone: '+config.phone,config.email && 'Email: '+config.email].filter(Boolean);
        return reply(lines.length?lines.join('\n'):'A public phone number and email have not been added yet. You can send your details through the connected Google inquiry form.',null,['Book a visit','Clinic details'],[contact],'contact');
      }
      if (/\b(international|overseas|abroad|travell?ing|usa|uk|germany|flight)\b/.test(q)) return reply('You can contact Hello Teeth before travelling to Lucknow. Confirm availability, the number of visits, follow-up arrangements, and estimated costs with the clinic before booking flights. This chat cannot confirm a travel or treatment schedule.',null,['Clinic details','Book a visit'],[['International patient guide','international'],contact],'travel');
      if (/\b(book\w*|appointments?|inquiry|enquiry|contact|human|staff)\b|speak to|talk to|arrange a visit/.test(q)) return reply('To request a visit, open our inquiry form and submit your name, contact details, country, and general reason for visiting. The clinic will need to confirm the appointment directly. This conversation is not sent to staff and does not reserve a time.',null,['Clinic details','Opening hours'],[contact],'booking');
      if (found.length>1 && /\b(vs|versus|difference|compare|or)\b/.test(q) && specific.length>1) {
        const keys=specific.slice(0,2);
        return reply(keys.map(k=>topics[k].title+': '+topics[k].overview).join('\n\n')+'\n\nA dentist can help choose based on your teeth, goals, and suitability.',null,keys.map(k=>topics[k].title),keys.map(k=>['More about '+topics[k].title,topics[k].page]),'comparison');
      }
      if (explicit) {
        if (explicit==='pain' && /\b(days?|weeks?|months?|yesterday|today|hours?|din)\b/.test(q)) return reply('Tooth pain lasting more than two days needs a dental assessment. Seek care sooner for severe pain, swelling, or fever. Duration alone cannot identify the cause; share when it started and any triggers with your dentist.', 'pain',['Home care','Book a visit']);
        if (explicit==='pain') pending='symptom-duration';
        return reply(topics[explicit].overview,explicit,explicit==='pain'?['Since today','More than two days','Home care']:['How long does it take?','Treatment costs','Tell me more']);
      }
      if (current==='pain' && /\b(days?|weeks?|months?|yesterday|today|hours?|din)\b/.test(q)) {
        pending=null;
        return reply('Thank you for clarifying. Toothache lasting more than two days should be assessed by a dentist; seek care sooner if pain is severe or comes with swelling or fever. Even short-lived pain may need a check if it recurs. I cannot determine the cause from the duration alone.', 'pain',['Home care','Book a visit']);
      }
      if (current==='sensitivity' && /\b(quickly|seconds|lingers?|keeps?|aching|goes away|lasts)\b/.test(q)) return reply('That detail is useful to share with your dentist. The length and triggers of pain help guide an assessment, but do not confirm a diagnosis. Arrange a dental check, especially if the discomfort persists or affects one tooth.', 'sensitivity',['Book a visit','Home care']);
      if (/\b(more|explain further|what next)\b|^why[?!.]*$/.test(q)) {
        if (!current) return reply('Which topic would you like me to explain?',null,defaults,[],'clarify');
        pending='aspect';
        return reply(`For ${topics[current].title}, would you like to know about the process, duration, discomfort, or care afterward?`,null,['How does it work?','How long does it take?','Will it hurt?','Aftercare'],[],'clarify');
      }
      if (/how does it work|\b(process|procedure)\b/.test(q) && current) return reply(topics[current].overview,current,['How long does it take?','Book a visit']);
      if (/^(yes|no|okay|ok|haan|nahi)[!.?]*$/.test(q)) return reply(pending?'Please choose the detail you want to discuss so I do not guess what you mean.':'What would you like to know next?',null,pending==='symptom-duration'?['Since today','More than two days','Home care']:defaults,[],'clarify');
      if (/\b(treatments?|services?|options?)\b/.test(q)) return reply('Hello Teeth’s website covers everyday care, smile makeovers, dental implants, aligners and braces, restorative care, and children’s dentistry. Ask about a specific option and I can explain it. Confirm availability and suitability with the clinic.',null,['Root canal treatment','Dental implants','Teeth whitening','Braces'],[['All care options','treatments']]);
      if (/^(hi|hello|hey|namaste|good morning)[!. ]*$/.test(q)) return reply('Hello! Ask me a dental question such as “What is a root canal?” or “Why do my gums bleed?”');
      if (/\b(thanks|thank you|thankyou)\b/.test(q)) return reply('You’re welcome. You can ask a follow-up or start a new dental topic.');
      if (/\b(scared|anxious|afraid|nervous|fear)\b/.test(q)) return reply('Tell the dental team what worries you before the appointment. Ask them to explain each step and agree on a signal if you need a pause. You can use your inquiry to mention that you would like to discuss comfort first.',null,['Book a visit','Root canal treatment'],[contact]);
      return reply('I could not confidently match that question. Could you rephrase it with the tooth problem or treatment name? For example: “My gums bleed when brushing”, “What is an implant?”, or “How long do braces take?” I can answer common dental topics, but I am not a general AI or a dentist.',null,defaults,[contact],'unknown');
    }
    return {answer,reset};
  }
  return {create};
});
