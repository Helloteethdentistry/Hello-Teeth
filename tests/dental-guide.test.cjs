const {test}=require('node:test');
const assert=require('node:assert/strict');
const {create}=require('../dental-guide.js');
const config={address:'1/346 Virat Khand, Gomti Nagar, Lucknow 226010'};
for(const question of ['Explore treatments','explore treatment','What treatments do you offer?','explore treament','Services']){
 test('Treatment menu: '+question,()=>{
  const r=create(config).answer(question);
  assert.equal(r.intent,'information');assert.match(r.message,/everyday care/);
  assert.ok(r.links.some(([,href])=>href==='treatments'));
  assert.ok(!r.links.some(([,href])=>href==='contact'));
 });
}
for(const [q,topic] of [['What is a root canal?','root'],['What are root canals?','root'],['What does a dentist do for implants?','implants'],['How do aligners work?','aligners'],['Braces','braces'],['Teeth whitening','whitening'],['My gums bleed when brushing','gums'],['Bad breath','breath'],['Cold water hurts my tooth','sensitivity'],['My teeth are hurting','pain'],['mere daant me dard hai','pain'],['My child has tooth pain','pain'],['Brushing tips','hygiene']]){
 test('Specific topic: '+q,()=>{const r=create(config).answer(q);assert.equal(r.topic,topic);assert.notEqual(r.intent,'booking');assert.ok(r.message.length>100);});
}
test('Context tracks costs, discomfort and switches',()=>{
 const g=create();g.answer('Dental implants');assert.match(g.answer('how much does it cost?').message,/dental implants/);
 assert.equal(g.answer('Will it hurt?').intent,'discomfort');
 assert.equal(g.answer('How long does it take?').intent,'duration');
 g.answer('What is a root canal?');assert.match(g.answer('what about the price?').message,/root canal treatment/);
 assert.equal(g.answer('My gums are bleeding').topic,'gums');
});
test('Procedure question does not become symptom triage',()=>{const r=create().answer('Are root canals painful?');assert.equal(r.intent,'discomfort');assert.match(r.message,/anaesthetic/);});
test('Duration question first asks a topic and uses the answer',()=>{const g=create();assert.equal(g.answer('How long does it take?').intent,'clarify');assert.equal(g.answer('Braces').intent,'duration');});
test('Pain duration is acknowledged without asking again',()=>{const g=create();g.answer('Tooth pain');assert.match(g.answer('Three days').message,/two days/);assert.doesNotMatch(g.answer('Pain for 3 days').message,/How long/);});
for(const q of ['I cannot breathe','my neck is swollen','Swelling around my eye','the bleeding will not stop','No fever but I cannot swallow'])test('Emergency: '+q,()=>assert.equal(create().answer(q).intent,'emergency'));
for(const q of ['No swelling; what is a root canal?','No difficulty breathing. How much are braces?','I do not have fever, explain implants'])test('Negation: '+q,()=>assert.ok(!['emergency','urgent'].includes(create().answer(q).intent)));
test('Urgent concerns take priority over costs',()=>assert.equal(create().answer('My face is swollen, how much are implants?').intent,'urgent'));
test('No medicine selection',()=>assert.equal(create().answer('What antibiotics should I take?').intent,'medication'));
test('No invented clinic hours or prices',()=>{assert.match(create().answer('Opening hours').message,/not provided/);assert.match(create().answer('What is the price of whitening?').message,/cannot quote/);});
test('Supplied clinic profile and hours are returned only when configured',()=>{const guide=create({dentistName:'Dr. Shivani Singh',dentistQualifications:'BDS with Endodontic Certification',dentistExperienceSince:'2012',dentistMembership:'Indian Dental Association',openingHours:'24 hours a day, 7 days a week'});assert.match(guide.answer('dentist qualifications').message,/BDS with Endodontic Certification/);assert.match(guide.answer('dentist qualifications').message,/2012/);assert.match(guide.answer('Opening hours').message,/24 hours a day/);});
test('Address uses configuration',()=>assert.match(create(config).answer('Where is your clinic?').message,/226010/));
test('Unknown question clarifies instead of pretending',()=>assert.equal(create().answer('Will it work for zzz?').intent,'unknown'));
test('Comparison answers both topics',()=>{const r=create().answer('Difference between braces and aligners');assert.equal(r.intent,'comparison');assert.match(r.message,/braces/);assert.match(r.message,/aligners/);});
test('Clear removes earlier topic',()=>{const g=create();g.answer('Implants');g.reset();assert.doesNotMatch(g.answer('What does it cost?').message,/implants/);});
test('Dental information links stay inside the Hello Teeth website',()=>{
 for(const q of ['What is a root canal?','Teeth whitening','My tooth hurts','My face is swollen']){
  const r=create().answer(q);assert.ok(r.links.every(([,href])=>!/^https?:\/\//.test(href)),q);
 }
});
test('Every suggested reply is understood in its conversation',()=>{
 for(const first of ['Explore treatments','Root canal treatment','Tooth pain','Daily care','Dental implants','Teeth whitening','Clinic details','Opening hours','Book a visit','International patients','Tell me more']){
  for(const choice of create(config).answer(first).choices){
   const g=create(config);g.answer(first);assert.notEqual(g.answer(choice).intent,'unknown',first+' -> '+choice);
  }
 }
});
