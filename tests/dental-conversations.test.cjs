const {test}=require('node:test');
const assert=require('node:assert/strict');
const {create,groups,home}=require('../dental-conversations.js');
test('215 supplied questions are available, excluding personal collection prompts',()=>{assert.equal(groups.reduce((n,g)=>n+g.questions.length,0),215);assert.equal(groups.length,17);assert.equal(home.length,8);});
test('Every library question gets a safe response in its selected category',()=>{
 for(const group of groups)for(const q of group.questions){const g=create();g.selectCategory(group.name);const r=g.answer(q);assert.ok(r.message.length>35,q);assert.notEqual(r.intent,'unknown',q);assert.notEqual(r.intent,'handoff',q);}
});
test('Home buttons all work',()=>{for(const q of home)assert.notEqual(create().answer(q).intent,'unknown',q);});
test('Pain flow remembers warning symptoms despite cost question',()=>{const g=create();assert.equal(g.answer('Tooth Pain').intent,'clarify');g.answer('Moderate');assert.equal(g.answer('Two days').intent,'clarify');assert.equal(g.answer('Yes. How much will treatment cost?').intent,'urgent');assert.match(g.answer('What is the price?').message,/urgent symptoms/);});
test('Severe pain is escalated promptly',()=>{const g=create();g.answer('Tooth Pain');assert.equal(g.answer('Severe').intent,'urgent');});
test('Child symptom flow',()=>{const g=create();assert.match(g.answer('My child has tooth pain').message,/old/);assert.match(g.answer('Six years old').message,/child/);assert.equal(g.answer('There is swelling').intent,'urgent');});
test('Sensitivity duration follow-up',()=>{const g=create();g.answer('It hurts when I drink cold water');assert.match(g.answer('About one minute').message,/duration/);});
test('Braces follow-up',()=>{const g=create();g.answer('I want braces');assert.match(g.answer('Adult').message,/option/);assert.match(g.answer('Which is best?').message,/orthodontic assessment/);});
test('Extraction follows timing and symptom',()=>{const g=create();g.answer('I had my tooth removed');g.answer('Yesterday');assert.match(g.answer('It is bleeding').message,/blood-stained saliva/);});
test('Never claims live staff connection or received appointment',()=>{const g=create();assert.match(g.answer('Talk to Receptionist').message,/no live receptionist/i);assert.doesNotMatch(g.answer('Book Appointment').message,/has been received|appointment is confirmed/i);});
test('Cancellation and reminders are honest',()=>{assert.match(create().answer('Cancel my appointment').message,/not been changed or cancelled/);assert.match(create().answer('Can you remind me?').message,/cannot schedule/);});
test('No stopping prescribed medication',()=>assert.match(create().answer('Should I stop blood thinning medicines?').message,/Do not stop/));
test('Two misses offer truthful contact',()=>{const g=create();g.answer('zzzx');assert.equal(g.answer('xxzz').intent,'handoff');g.reset();assert.equal(g.answer('xxzz').intent,'unknown');});
test('Emergencies interrupt active flow',()=>{const g=create();g.answer('I want braces');assert.equal(g.answer('I cannot breathe').intent,'emergency');});
test('Unknown clinic policy is not invented',()=>{assert.match(create().answer('Is parking available?').message,/not provided/);assert.match(create().answer('Do you accept UPI?').message,/not been supplied/);});
test('Treatment and aftercare answers do not send visitors to other websites',()=>{
 for(const q of ['My crown came out','Something is stuck between my teeth','My jaw clicks','Wisdom tooth removal','Dental Emergency']){
  const r=create().answer(q);assert.ok(r.links.every(([,href])=>!/^https?:\/\//.test(href)),q);
 }
});
test('Configured professional details answer qualification questions',()=>{const g=create({dentistName:'Dr. Shivani Singh',dentistQualifications:'BDS with Endodontic Certification',dentistExperienceSince:'2012',dentistMembership:'Indian Dental Association'});assert.match(g.answer('Can I see the dentist’s qualifications?').message,/Endodontic Certification/);assert.match(g.answer('Can I see the dentist’s qualifications?').message,/Indian Dental Association/);});
