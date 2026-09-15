/* Conversation flows adapted from the clinic's supplied question series. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./dental-guide.js'),require('./chat-questions.js'));
  else root.DentalConversations=factory(root.DentalGuide,root.DentalQuestions);
})(typeof globalThis!=='undefined'?globalThis:this,function(Guide,groups){
  'use strict';
  const home=['Book Appointment','Dental Emergency','Tooth Pain','Treatments','Treatment Cost','Clinic Location','Clinic Timings','Talk to Receptionist'];
  const inquiry=['Open appointment inquiry form','contact'];
  const normalize=s=>s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const seeds={'Check-ups & cleaning':'Daily care','Fillings':'Fillings','Root canals':'Root canal treatment','Crowns & bridges':'Dental crowns','Implants & dentures':'Dental implants','Braces & aligners':'Braces','Cosmetic dentistry':'Teeth whitening','Gum care':'Gums','Children’s dentistry':'Children’s dentistry'};
  function create(config={}){
    const base=Guide.create(config);
    let stage=null,group=null,misses=0,concern=null,severity=null,age=null,elapsed=null,needsUrgent=false;
    function result(message,choices=home,links=[],intent='information'){
      return {message,choices,links,intent,topic:concern};
    }
    function reset(){base.reset();stage=group=concern=severity=age=elapsed=null;misses=0;needsUrgent=false;}
    function selectCategory(name){group=groups.find(g=>g.name===name)||null;stage=null;if(seeds[name])base.answer(seeds[name]);}
    function referral(message='To request an appointment, open the Google inquiry form below and submit your details. The clinic must confirm your date and time. This chat does not submit a request or reserve a slot.'){
      return result(message,['Clinic Location','Clinic Timings','Treatments'],[inquiry],'booking');
    }
    function urgent(message='Please contact a dentist urgently for assessment. Do not wait for an online inquiry. If you have trouble breathing or swallowing, swelling around the eye or neck, or bleeding that will not stop, seek emergency medical care now.'){
      stage=null;needsUrgent=true;misses=0;
      const links=[];
      if(/^\+?[\d\s()-]{7,22}$/.test(config.phone||''))links.push(['Call the clinic','tel:'+config.phone.replace(/[\s()-]/g,'')]);
      return result(message,['Clinic Location','Start over'],links,'urgent');
    }
    function answer(raw){
      const q=normalize(String(raw).slice(0,600));
      if(!q)return result('Choose a topic or type a short dental question.');
      if(/^(start over|main menu|new topic)$/.test(q)){reset();return result('Welcome to Hello Teeth Dental Clinic, Lucknow. How may I help you?');}
      // Medical red flags remain higher priority than booking, menu and cost intents.
      const basic=base.answer(raw);
      if(basic.intent==='emergency'||/\b(unconscious|loss of consciousness|major facial injury|serious (face|facial|jaw) injury|severe allergic reaction|rapidly increasing.{0,12}swelling)\b/.test(q)){
        stage=null;needsUrgent=true;misses=0;
        return basic.intent==='emergency'?basic:result('This may require emergency medical attention. Contact local emergency services or go to the nearest emergency department now. Do not delay for a clinic message or an appointment request.',['Clinic Location'],[],'emergency');
      }
      if(basic.intent==='urgent'){stage=null;needsUrgent=true;concern=concern||'tooth symptoms';misses=0;return urgent(basic.message);}
      if(/stop.{0,30}(medicine|medication|blood|tablet)|blood thinning|blood thinner|regular medicine|prescribed medicine/.test(q))return result('Do not stop or change prescribed medicines on the advice of this chatbot. Tell your dentist about your medicines and ask both the dentist and prescribing clinician for instructions before treatment.',['Book Appointment'],[inquiry],'medication');
      if(basic.intent==='medication')return basic;
      if(/^(dental emergency|do i need an emergency appointment)$/.test(q)||/emergency (dentist|dental treatment).*(available|right now)|book emergency/.test(q)){
        stage='emergency';return result('I cannot verify emergency dentist availability. Are you having breathing or swallowing difficulty, heavy bleeding that will not stop, swelling, or a recent tooth injury? Do not wait here if you need emergency medical care.',['Difficulty breathing','Swelling','Knocked-out tooth','Tooth Pain'],[],'clarify');
      }
      if(/receptionist|live (agent|chat)|speak (with|to)|talk to/.test(q))return referral('There is no live receptionist connected to this chat. Use the inquiry form to request contact from the clinic. No message has been sent by this conversation.');
      if(/reschedul|cancel.*appointment/.test(q))return referral('Request the change directly from the clinic through the inquiry form. Include the original appointment date in your request. Your appointment has not been changed or cancelled here; wait for the clinic to confirm.');
      if(/remind|reminder/.test(q))return referral('This website cannot schedule or send appointment reminders. Ask the clinic whether it offers reminders, and save your confirmed appointment in your own calendar.');
      if(/slots?|walk in|arrive|documents|someone else|online consultation/.test(q))return referral('I cannot check live slots or confirm the clinic’s walk-in, arrival, document, or online-consultation arrangements. Ask the clinic through the inquiry form. For another person, use their permission and an appropriate contact person; the clinic must confirm the request.');
      if(/\b(upi|cards?|cash|emi|insurance|receipt|offers?|packages?|payment methods|follow up visits chargeable|x rays included|bill)\b/.test(q))return result('These payment, insurance, package, and fee-inclusion details have not been supplied by the clinic. Ask for a written estimate and confirm accepted payment methods, follow-up charges, and receipts directly. I cannot promise a discount, insurance cover, or finance option.',['Book Appointment','Treatment Cost'],[inquiry],'policy');
      if(/qualifications|qualified|degree|degrees|experience|ida member|dental association/.test(q))return base.answer('dentist qualifications');
      if(/parking|wheelchair|languages|reviews|sterilis|steriliz|safety.*measures|areas.*serve/.test(q))return result('The clinic has not provided verified details for that question. Please ask through the inquiry form before relying on parking, accessibility, languages, reviews, or facility arrangements.',['Clinic Location','Talk to Receptionist'],[inquiry],'policy');
      if(/^clinic timings$/.test(q))return base.answer('Opening hours');
      if(/maps location|share location|complete clinic address|hello teeth.*located/.test(q))return base.answer('Clinic location');
      if(/pregnan|diabetic|heart patients|allergies|drive after|numbness|eat before/.test(q))return result('Tell the dentist about pregnancy, health conditions, allergies, and all medicines before care. Eating, driving, and recovery instructions depend on the planned procedure and anaesthetic. Ask the treating team for individual instructions; do not stop prescribed medicine without the prescribing clinician’s advice.',['Book Appointment'],[inquiry],'preparation');
      if(basic.intent==='cost' && needsUrgent)return result('The price depends on the dental assessment and recommended treatment. Because urgent symptoms were mentioned, seek care promptly rather than waiting for a quotation. I cannot provide an exact cost.',['Clinic Location'],[inquiry],'cost');
      // A positive answer to the current symptom question is still meaningful if a cost question follows.
      if(stage==='redflags' && /^(yes|yeah|there is|i do)\b/.test(q))return urgent('You indicated that one of the warning symptoms is present. Please seek urgent dental assessment. If this includes breathing or swallowing difficulty or bleeding that will not stop, seek emergency medical care now. Costs depend on assessment; do not delay care for a quote.');
      if(stage==='redflags' && /^(no|none|not sure)\b/.test(q)){
        stage=null;
        return severity==='Severe'?urgent('Severe tooth pain needs urgent dental advice even without swelling. Arrange assessment promptly; if new swelling or breathing or swallowing difficulty develops, seek emergency help.'):
          result('Thank you. A dentist still needs to assess persistent or recurring tooth pain. Tell them its severity, duration, and triggers. If swelling, fever, worsening pain, or breathing difficulty develops, seek urgent care.',['Book Appointment','Home care'],[inquiry]);
      }
      if(stage==='age' && /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve).*(year|month)|^(\d{1,2})$/.test(q)){
        age=q;stage='redflags';return result('Thank you. Does your child have swelling, fever, a recent injury, or severe pain?',['Swelling','Severe pain','None of these'],[],'clarify');
      }
      if(stage==='severity' && /^(mild|moderate|severe)( pain)?$/.test(q)){
        severity=q.startsWith('severe')?'Severe':q.startsWith('moderate')?'Moderate':'Mild';
        if(severity==='Severe')return urgent('Severe tooth pain needs urgent dental assessment. If it comes with swelling or fever, explain that when seeking care. Breathing or swallowing difficulty requires emergency medical care.');
        stage='duration';return result('How long have you had the pain?',['Less than 24 hours','1–3 days','More than 3 days'],[],'clarify');
      }
      if(stage==='duration' && /\b(hour|hours|day|days|week|weeks|yesterday|today|din)\b/.test(q)){
        elapsed=q;stage='redflags';return result('Do you also have swelling, fever, pus, or difficulty opening your mouth?',['Yes','No','Not sure'],[],'clarify');
      }
      if(stage==='aligner-age'&&/^(adult|child)$/.test(q)){
        stage='aligner-choice';return result('Which option would you like to understand?',['Metal braces','Ceramic braces','Clear aligners','Not sure'],[],'clarify');
      }
      if(stage==='aligner-choice'&&/not sure|best/.test(q)){
        stage=null;return result('The best option depends on alignment, bite, appearance preferences, maintenance, and budget. An orthodontic assessment is needed to recommend one for you.',['Braces','Clear aligners','Book Appointment'],[inquiry]);
      }
      if(stage==='extraction-time'&&/\b(yesterday|today|day|days|hour|hours|week|weeks)\b/.test(q)){
        elapsed=q;stage='extraction-symptom';return result('What is concerning you since the extraction?',['Pain','Bleeding','Swelling','Fever'],[],'clarify');
      }
      if(stage==='extraction-symptom'&&/^bleeding|^it is bleeding/.test(q)){
        stage=null;return result('Some blood-stained saliva can occur after extraction. Follow your treating dentist’s instructions. Persistent, heavy, or worsening bleeding needs urgent advice; if bleeding will not stop or you feel faint, seek emergency care.',['Clinic Location','Book Appointment'],[],'aftercare');
      }
      if(stage==='extraction-symptom'&&/^pain|^it hurts/.test(q)){
        stage=null;return result('Follow the aftercare instructions from the dentist who treated you. Pain that worsens rather than settles should be reviewed. Fever, swelling, or uncontrolled bleeding needs urgent attention.',['Clinic Location'],[],'aftercare');
      }
      if(stage==='sensitivity-duration'&&/\b(second|seconds|minute|minutes|quickly|lingers|goes away|keeps aching)\b/.test(q)){
        stage=null;return result('That duration is useful to tell your dentist. Sensitivity that continues after the trigger stops needs a dental assessment. It does not, by itself, confirm that you need a filling or a root canal.',['Book Appointment','Root canal treatment'],[inquiry]);
      }
      if(/cannot open.*mouth|cant open.*mouth|difficulty opening.*mouth|\bpus\b|tooth has been knocked out|knocked out tooth/.test(q))return urgent();
      if(/severe tooth pain|severe pain/.test(q)&&!/no severe/.test(q))return urgent('Severe tooth pain needs urgent dental advice. Please seek assessment promptly. Swelling with breathing or swallowing difficulty, or uncontrolled bleeding, needs emergency medical care.');
      if(/my child.*(pain|hurt)|child has tooth pain/.test(q)){
        concern='your child’s tooth pain';stage='age';return result('I’m sorry your child is uncomfortable. How old is your child? If there is swelling, fever, injury, or severe pain, seek prompt dental advice.',['Under 1 year','Six years old','Swelling'],[],'clarify');
      }
      if(/^(tooth pain|my tooth hurts|i have tooth pain|i have a dental problem can you help me)$/.test(q)){
        concern='tooth pain';stage='severity';return result('I’m sorry you’re uncomfortable. How severe is the pain? If you have swelling, fever, or difficulty breathing or swallowing, tell us immediately and seek urgent care.',['Mild','Moderate','Severe'],[],'clarify');
      }
      if(/^(i want braces|braces consultation)$/.test(q)){
        concern='braces';stage='aligner-age';return result('Is the braces consultation for an adult or a child?',['Adult','Child'],[],'clarify');
      }
      if(/i had my tooth (removed|extracted)|i had.*extraction/.test(q)){
        concern='extraction recovery';stage='extraction-time';return result('When was the extraction performed? If bleeding is heavy or will not stop, seek urgent care now.',['Today','Yesterday','More than 3 days'],[],'clarify');
      }
      if(/(filling|crown).*(come out|came out|fallen|fell|loose)|broken crown/.test(q))return result('Contact a dentist to assess the tooth or restoration. Keep any loose piece to show them, avoid chewing on the affected side, and do not use household glue to reattach it. Severe pain, swelling, or bleeding needs prompt advice.',['Book Appointment','Clinic Location'],[]);
      if(/broken|chipped|piece.*(broke|broken)|tooth.*injured/.test(q))return result('A damaged tooth needs dental assessment, even if it does not hurt. Avoid chewing on that side and do not attempt a repair yourself. A recent injury, severe pain, or bleeding needs urgent dental advice.',['Book Appointment','Clinic Location'],[]);
      if(/stuck between/.test(q))return result('Avoid sharp objects or forcing anything between your teeth. If gentle normal cleaning does not remove the object, or there is pain or bleeding, ask a dentist for help.',['Book Appointment'],[]);
      if(/ulcers?/.test(q))return result('Mouth ulcers have different causes and cannot be diagnosed here. Have an ulcer checked if it is persistent, worsening, unusual, or making eating or drinking difficult.',['Book Appointment'],[]);
      if(/jaw.*(click|hurt|pain|lock)/.test(q))return result('Jaw clicking and pain can have several causes. A dentist can assess your jaw and bite. If your jaw locks, you cannot open your mouth, or you cannot eat or drink, seek prompt medical or dental advice.',['Book Appointment'],[]);
      if(/loose tooth|tooth loose|tooth is loose|loose teeth/.test(q))return urgent('A loose adult tooth needs prompt dental assessment, especially after an injury or with sore or swollen gums. A dentist must determine the cause and whether it can be saved.');
      if(/wisdom|extraction|tooth removal|tooth extraction/.test(q)&&basic.intent!=='cost'){
        concern='extraction';
        return result('Not every wisdom tooth needs removal. A dentist assesses whether a tooth is causing problems and explains alternatives, anaesthetic, recovery, and costs. After removal, follow the treating team’s instructions; worsening pain, swelling, fever, or ongoing bleeding needs review.',['Treatment Cost','Book Appointment'],[]);
      }
      if(/\b(bridge|dentures?|sealants?|fluoride treatment|retainers?)\b/.test(q)&&basic.intent!=='cost'){
        const term=/bridge/.test(q)?'A bridge replaces a missing tooth using a replacement supported by other teeth or implants.':/denture/.test(q)?'Dentures are removable replacements for missing teeth.':/sealant/.test(q)?'Dental sealants cover grooves in teeth to help protect against decay.':/retainer/.test(q)?'Retainers help maintain tooth position after orthodontic treatment.':'Fluoride treatment is used by dental professionals to help protect teeth against decay.';
        return result(term+' Ask the clinic about suitability, availability, care instructions, and the treatment plan for you.',['Book Appointment','Treatment Cost'],[inquiry]);
      }
      if(/do i need|am i eligible|which.*best|how can i know|can.*be (saved|filled)|will.*last|how long.*last/.test(q))return result('That depends on an examination, the condition of the teeth and gums, and your care plan. The dentist may need X-rays before recommending treatment. I cannot determine suitability or guarantee how long a treatment will last from chat.',['Book Appointment','Treatments'],[inquiry]);
      // Exact supplied questions retain the category selected in the question browser.
      const matches=groups.filter(g=>g.questions.some(s=>normalize(s)===q));
      if(matches.length){
        const matched=matches.find(g=>g===group)||matches[0];
        if(group!==matched&&seeds[matched.name])base.answer(seeds[matched.name]);
        group=matched;
        const grounded=base.answer(raw);
        if(grounded.intent!=='unknown'&&grounded.intent!=='clarify'){misses=0;return grounded;}
        misses=0;
        return result(`For ${matched.name.toLowerCase()}, the answer depends on the individual examination and planned procedure. Ask the clinic this question before treatment so you receive instructions specific to your care. I do not have a verified clinic policy or personalised treatment plan to give a definite answer.`,['Book Appointment','Treatments'],[inquiry],'needs-clinic');
      }
      if(basic.intent==='unknown'){
        misses++;
        return misses>=2?result('I’m unable to answer that accurately. You can contact the Hello Teeth team using the inquiry form below. No live staff connection or message has been made here.',['Talk to Receptionist','Start over'],[inquiry],'handoff'):
          result('I didn’t fully understand. Please choose the closest option or describe the dental problem in a few words.',['Tooth Pain','Swelling','Broken tooth','Bleeding gums','Braces','Treatment Cost','Book Appointment','Talk to Receptionist'],[],'unknown');
      }
      misses=0;
      if(basic.topic==='sensitivity')stage='sensitivity-duration';
      if(basic.topic)concern=basic.topic;
      return basic;
    }
    return {answer,reset,selectCategory};
  }
  return {create,home,groups};
});
