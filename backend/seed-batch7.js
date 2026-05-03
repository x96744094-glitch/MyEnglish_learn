// 第七批次 - 突破1000單字 - 執行: node seed-batch7.js
require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('./models/Vocabulary');

const MONGODB_URI = (process.env.MONGODB_URI || '').trim().replace(/ㄦ/g, '-');
if (!MONGODB_URI) { console.error('請設定 MONGODB_URI'); process.exit(1); }

const newWords = [
  // ===== A2 - Transportation =====
  { word: 'bicycle', pronunciation: '/ˈbaɪsɪkəl/', partOfSpeech: 'noun', translation: '自行車', explanation: 'A vehicle with two wheels powered by pedals.', examples: [{ sentence: 'I ride my bicycle to work.', translation: '我騎自行車上班。' }], level: 'A2', tags: ['transport'] },
  { word: 'motorcycle', pronunciation: '/ˈmoʊtərsaɪkəl/', partOfSpeech: 'noun', translation: '機車', explanation: 'A two-wheeled motor vehicle.', examples: [{ sentence: 'He drives a motorcycle.', translation: '他騎機車。' }], level: 'A2', tags: ['transport'] },
  { word: 'truck', pronunciation: '/trʌk/', partOfSpeech: 'noun', translation: '卡車', explanation: 'A large vehicle for carrying goods.', examples: [{ sentence: 'The truck delivered the goods.', translation: '卡車運送了貨物。' }], level: 'A2', tags: ['transport'] },
  { word: 'helicopter', pronunciation: '/ˈhɛlɪkɒptər/', partOfSpeech: 'noun', translation: '直升機', explanation: 'An aircraft with rotating blades.', examples: [{ sentence: 'The helicopter landed nearby.', translation: '直升機在附近降落。' }], level: 'A2', tags: ['transport'] },
  { word: 'submarine', pronunciation: '/ˌsʌbməˈriːn/', partOfSpeech: 'noun', translation: '潛水艇', explanation: 'A ship that can travel underwater.', examples: [{ sentence: 'The submarine dived deep.', translation: '潛水艇潛入深處。' }], level: 'B1', tags: ['transport'] },
  { word: 'ferry', pronunciation: '/ˈfɛri/', partOfSpeech: 'noun', translation: '渡輪', explanation: 'A boat for carrying people across water.', examples: [{ sentence: 'We took the ferry to the island.', translation: '我們搭渡輪到島上。' }], level: 'A2', tags: ['transport', 'travel'] },
  { word: 'tram', pronunciation: '/træm/', partOfSpeech: 'noun', translation: '電車', explanation: 'A vehicle that runs on rails in a city.', examples: [{ sentence: 'Take the tram to the city centre.', translation: '搭電車到市中心。' }], level: 'A2', tags: ['transport'] },
  { word: 'freight', pronunciation: '/freɪt/', partOfSpeech: 'noun', translation: '貨物；貨運', explanation: 'Goods transported by road, air, or sea.', examples: [{ sentence: 'The freight arrived on time.', translation: '貨物準時到達。' }], level: 'B2', tags: ['transport', 'economy'] },
  { word: 'passenger', pronunciation: '/ˈpæsɪndʒər/', partOfSpeech: 'noun', translation: '乘客', explanation: 'A person travelling in a vehicle.', examples: [{ sentence: 'The passengers boarded the plane.', translation: '乘客登上了飛機。' }], level: 'B1', tags: ['transport', 'travel'] },
  { word: 'vehicle', pronunciation: '/ˈviːɪkəl/', partOfSpeech: 'noun', translation: '交通工具；車輛', explanation: 'A machine used for transport.', examples: [{ sentence: 'Electric vehicles are popular.', translation: '電動車很受歡迎。' }], level: 'B1', tags: ['transport'] },

  // ===== A2 - Communications / Technology =====
  { word: 'telephone', pronunciation: '/ˈtɛlɪfoʊn/', partOfSpeech: 'noun', translation: '電話', explanation: 'A device for speaking to someone at a distance.', examples: [{ sentence: 'The telephone is ringing.', translation: '電話在響。' }], level: 'A1', tags: ['technology', 'communication'] },
  { word: 'message', pronunciation: '/ˈmɛsɪdʒ/', partOfSpeech: 'noun', translation: '訊息；消息', explanation: 'A written or spoken communication.', examples: [{ sentence: 'Leave me a message.', translation: '留給我一條訊息。' }], level: 'A2', tags: ['technology', 'communication'] },
  { word: 'email', pronunciation: '/ˈiːmeɪl/', partOfSpeech: 'noun', translation: '電子郵件', explanation: 'Electronic mail sent over the internet.', examples: [{ sentence: 'Send me an email.', translation: '發電子郵件給我。' }], level: 'A2', tags: ['technology', 'communication'] },
  { word: 'website', pronunciation: '/ˈwɛbsaɪt/', partOfSpeech: 'noun', translation: '網站', explanation: 'A set of related web pages.', examples: [{ sentence: 'Check the company website.', translation: '查看公司網站。' }], level: 'A2', tags: ['technology'] },
  { word: 'search', pronunciation: '/sɜːrtʃ/', partOfSpeech: 'verb', translation: '搜尋；搜索', explanation: 'To look carefully for something.', examples: [{ sentence: 'Search for it online.', translation: '在網上搜尋它。' }], level: 'A2', tags: ['technology', 'verb'] },
  { word: 'screen', pronunciation: '/skriːn/', partOfSpeech: 'noun', translation: '螢幕', explanation: 'A flat surface that displays images.', examples: [{ sentence: 'The screen is cracked.', translation: '螢幕裂了。' }], level: 'A2', tags: ['technology'] },
  { word: 'keyboard', pronunciation: '/ˈkiːbɔːrd/', partOfSpeech: 'noun', translation: '鍵盤', explanation: 'A set of keys for a computer.', examples: [{ sentence: 'Type on the keyboard.', translation: '在鍵盤上打字。' }], level: 'A2', tags: ['technology'] },
  { word: 'camera', pronunciation: '/ˈkæmərə/', partOfSpeech: 'noun', translation: '相機', explanation: 'A device for taking photographs.', examples: [{ sentence: 'I bought a new camera.', translation: '我買了一部新相機。' }], level: 'A2', tags: ['technology', 'hobby'] },
  { word: 'battery', pronunciation: '/ˈbætəri/', partOfSpeech: 'noun', translation: '電池', explanation: 'A device that stores and provides electricity.', examples: [{ sentence: 'The battery is almost dead.', translation: '電池快沒電了。' }], level: 'A2', tags: ['technology'] },
  { word: 'charger', pronunciation: '/ˈtʃɑːrdʒər/', partOfSpeech: 'noun', translation: '充電器', explanation: 'A device for recharging a battery.', examples: [{ sentence: 'I forgot my phone charger.', translation: '我忘了帶手機充電器。' }], level: 'A2', tags: ['technology'] },
  { word: 'printer', pronunciation: '/ˈprɪntər/', partOfSpeech: 'noun', translation: '印表機', explanation: 'A device for printing documents.', examples: [{ sentence: 'The printer is out of ink.', translation: '印表機沒墨水了。' }], level: 'A2', tags: ['technology', 'work'] },
  { word: 'microphone', pronunciation: '/ˈmaɪkrəfoʊn/', partOfSpeech: 'noun', translation: '麥克風', explanation: 'A device for recording sound.', examples: [{ sentence: 'Speak into the microphone.', translation: '對著麥克風說話。' }], level: 'A2', tags: ['technology'] },
  { word: 'headphones', pronunciation: '/ˈhɛdfoʊnz/', partOfSpeech: 'noun', translation: '耳機', explanation: 'Devices worn over the ears to listen.', examples: [{ sentence: 'I use headphones on the train.', translation: '我在火車上用耳機。' }], level: 'A2', tags: ['technology'] },
  { word: 'remote', pronunciation: '/rɪˈmoʊt/', partOfSpeech: 'noun', translation: '遙控器', explanation: 'A device for controlling electronics.', examples: [{ sentence: 'Where\'s the TV remote?', translation: '電視遙控器在哪裡？' }], level: 'A2', tags: ['technology'] },

  // ===== B1 - Work / Business =====
  { word: 'career', pronunciation: '/kəˈrɪər/', partOfSpeech: 'noun', translation: '職業生涯', explanation: 'A long-term occupation.', examples: [{ sentence: 'She has a great career in medicine.', translation: '她在醫學領域有很棒的職業生涯。' }], level: 'B1', tags: ['work'] },
  { word: 'application', pronunciation: '/ˌæplɪˈkeɪʃən/', partOfSpeech: 'noun', translation: '申請；申請書', explanation: 'A formal request for a job or course.', examples: [{ sentence: 'Submit your application by Friday.', translation: '在周五前提交你的申請書。' }], level: 'B1', tags: ['work', 'education'] },
  { word: 'interview', pronunciation: '/ˈɪntərvjuː/', partOfSpeech: 'noun', translation: '面試；訪談', explanation: 'A meeting to assess a candidate.', examples: [{ sentence: 'I have a job interview tomorrow.', translation: '我明天有工作面試。' }], level: 'B1', tags: ['work'] },
  { word: 'resume', pronunciation: '/ˈrɛzjuːmeɪ/', partOfSpeech: 'noun', translation: '履歷', explanation: 'A document listing work experience.', examples: [{ sentence: 'Update your resume.', translation: '更新你的履歷。' }], level: 'B1', tags: ['work'] },
  { word: 'promotion', pronunciation: '/prəˈmoʊʃən/', partOfSpeech: 'noun', translation: '升職；晉升', explanation: 'An advancement to a higher position.', examples: [{ sentence: 'She got a promotion.', translation: '她升職了。' }], level: 'B1', tags: ['work'] },
  { word: 'deadline', pronunciation: '/ˈdɛdlaɪn/', partOfSpeech: 'noun', translation: '截止日期', explanation: 'The latest time for completing something.', examples: [{ sentence: 'Meet the deadline.', translation: '趕上截止日期。' }], level: 'B1', tags: ['work'] },
  { word: 'project', pronunciation: '/ˈprɒdʒɛkt/', partOfSpeech: 'noun', translation: '專案；計劃', explanation: 'A planned piece of work.', examples: [{ sentence: 'We\'re working on a big project.', translation: '我們正在做一個大專案。' }], level: 'B1', tags: ['work', 'education'] },
  { word: 'strategy', pronunciation: '/ˈstrætɪdʒi/', partOfSpeech: 'noun', translation: '策略', explanation: 'A plan designed to achieve a goal.', examples: [{ sentence: 'What\'s your strategy?', translation: '你的策略是什麼？' }], level: 'B2', tags: ['work'] },
  { word: 'client', pronunciation: '/ˈklaɪənt/', partOfSpeech: 'noun', translation: '客戶', explanation: 'A person who uses a service.', examples: [{ sentence: 'We have a new client.', translation: '我們有一個新客戶。' }], level: 'B1', tags: ['work'] },
  { word: 'employee', pronunciation: '/ˌɛmplɔɪˈiː/', partOfSpeech: 'noun', translation: '員工', explanation: 'A person who works for another.', examples: [{ sentence: 'She is a valuable employee.', translation: '她是一名有價值的員工。' }], level: 'B1', tags: ['work'] },
  { word: 'employer', pronunciation: '/ɪmˈplɔɪər/', partOfSpeech: 'noun', translation: '雇主', explanation: 'A person or company that employs workers.', examples: [{ sentence: 'My employer is very fair.', translation: '我的雇主非常公平。' }], level: 'B1', tags: ['work'] },
  { word: 'department', pronunciation: '/dɪˈpɑːrtmənt/', partOfSpeech: 'noun', translation: '部門', explanation: 'A division of a company or organization.', examples: [{ sentence: 'Which department do you work in?', translation: '你在哪個部門工作？' }], level: 'B1', tags: ['work'] },
  { word: 'teamwork', pronunciation: '/ˈtiːmwɜːrk/', partOfSpeech: 'noun', translation: '團隊合作', explanation: 'Working together to achieve a goal.', examples: [{ sentence: 'Good teamwork is essential.', translation: '良好的團隊合作很重要。' }], level: 'B1', tags: ['work'] },
  { word: 'overtime', pronunciation: '/ˈoʊvərtaɪm/', partOfSpeech: 'noun', translation: '加班', explanation: 'Working beyond normal hours.', examples: [{ sentence: 'I worked overtime last night.', translation: '我昨晚加班了。' }], level: 'B1', tags: ['work'] },
  { word: 'industry', pronunciation: '/ˈɪndəstri/', partOfSpeech: 'noun', translation: '產業；工業', explanation: 'A sector of the economy.', examples: [{ sentence: 'The tech industry is growing.', translation: '科技產業正在成長。' }], level: 'B1', tags: ['work', 'economy'] },

  // ===== B1 - Abstract Nouns =====
  { word: 'freedom', pronunciation: '/ˈfriːdəm/', partOfSpeech: 'noun', translation: '自由', explanation: 'The power to act or think without restraint.', examples: [{ sentence: 'Everyone deserves freedom.', translation: '每個人都應該得到自由。' }], level: 'B1', tags: ['society', 'value'] },
  { word: 'responsibility', pronunciation: '/rɪˌspɒnsɪˈbɪlɪti/', partOfSpeech: 'noun', translation: '責任', explanation: 'The duty to deal with something.', examples: [{ sentence: 'Take responsibility for your actions.', translation: '對自己的行為負責。' }], level: 'B1', tags: ['character', 'society'] },
  { word: 'opportunity', pronunciation: '/ˌɒpəˈtjuːnɪti/', partOfSpeech: 'noun', translation: '機會', explanation: 'A time when conditions are right.', examples: [{ sentence: 'Don\'t miss this opportunity.', translation: '不要錯過這個機會。' }], level: 'B1', tags: ['society'] },
  { word: 'challenge', pronunciation: '/ˈtʃælɪndʒ/', partOfSpeech: 'noun', translation: '挑戰', explanation: 'A difficult task or problem.', examples: [{ sentence: 'This is a great challenge.', translation: '這是一個很大的挑戰。' }], level: 'B1', tags: ['work', 'education'] },
  { word: 'solution', pronunciation: '/səˈluːʃən/', partOfSpeech: 'noun', translation: '解決方案', explanation: 'A way of solving a problem.', examples: [{ sentence: 'We need a solution.', translation: '我們需要一個解決方案。' }], level: 'B1', tags: ['academic', 'work'] },
  { word: 'advantage', pronunciation: '/ədˈvɑːntɪdʒ/', partOfSpeech: 'noun', translation: '優勢；好處', explanation: 'Something that gives a better position.', examples: [{ sentence: 'What are the advantages?', translation: '有哪些優勢？' }], level: 'B1', tags: ['academic'] },
  { word: 'disadvantage', pronunciation: '/ˌdɪsədˈvɑːntɪdʒ/', partOfSpeech: 'noun', translation: '劣勢；缺點', explanation: 'Something that makes things worse.', examples: [{ sentence: 'There are some disadvantages.', translation: '有一些缺點。' }], level: 'B1', tags: ['academic'] },
  { word: 'purpose', pronunciation: '/ˈpɜːrpəs/', partOfSpeech: 'noun', translation: '目的；目標', explanation: 'The reason for doing something.', examples: [{ sentence: 'What is the purpose of this?', translation: '這個的目的是什麼？' }], level: 'B1', tags: ['academic'] },
  { word: 'impact', pronunciation: '/ˈɪmpækt/', partOfSpeech: 'noun', translation: '衝擊；影響', explanation: 'A strong effect.', examples: [{ sentence: 'The impact was significant.', translation: '影響很顯著。' }], level: 'B1', tags: ['academic'] },
  { word: 'influence', pronunciation: '/ˈɪnfluəns/', partOfSpeech: 'noun', translation: '影響；影響力', explanation: 'The effect of something.', examples: [{ sentence: 'Music has a big influence on me.', translation: '音樂對我影響很大。' }], level: 'B1', tags: ['academic', 'society'] },
  { word: 'relationship', pronunciation: '/rɪˈleɪʃənʃɪp/', partOfSpeech: 'noun', translation: '關係', explanation: 'A connection between people or things.', examples: [{ sentence: 'They have a good relationship.', translation: '他們關係很好。' }], level: 'B1', tags: ['society'] },
  { word: 'experience', pronunciation: '/ɪkˈspɪəriəns/', partOfSpeech: 'noun', translation: '經驗；體驗', explanation: 'Knowledge from doing something.', examples: [{ sentence: 'I have work experience.', translation: '我有工作經驗。' }], level: 'B1', tags: ['work', 'education'] },
  { word: 'memory', pronunciation: '/ˈmɛməri/', partOfSpeech: 'noun', translation: '記憶；回憶', explanation: 'The ability to remember; a recollection.', examples: [{ sentence: 'I have good memories of childhood.', translation: '我對童年有美好的回憶。' }], level: 'B1', tags: ['psychology'] },
  { word: 'imagination', pronunciation: '/ɪˌmædʒɪˈneɪʃən/', partOfSpeech: 'noun', translation: '想像力', explanation: 'The ability to create mental images.', examples: [{ sentence: 'Children have great imagination.', translation: '孩子有很強的想像力。' }], level: 'B1', tags: ['psychology', 'art'] },
  { word: 'effort', pronunciation: '/ˈɛfərt/', partOfSpeech: 'noun', translation: '努力', explanation: 'Physical or mental energy applied to something.', examples: [{ sentence: 'Put more effort into studying.', translation: '在學習上付出更多努力。' }], level: 'B1', tags: ['education', 'work'] },

  // ===== B2 - Idiomatic Adjectives =====
  { word: 'comprehensive', pronunciation: '/ˌkɒmprɪˈhɛnsɪv/', partOfSpeech: 'adjective', translation: '全面的；綜合的', explanation: 'Including everything or nearly everything.', examples: [{ sentence: 'We need a comprehensive plan.', translation: '我們需要一個全面的計劃。' }], level: 'B2', tags: ['academic', 'adjective'] },
  { word: 'fundamental', pronunciation: '/ˌfʌndəˈmɛntəl/', partOfSpeech: 'adjective', translation: '基本的；根本的', explanation: 'Forming a necessary base.', examples: [{ sentence: 'This is a fundamental right.', translation: '這是一項基本權利。' }], level: 'B2', tags: ['academic', 'adjective'] },
  { word: 'controversial', pronunciation: '/ˌkɒntrəˈvɜːrʃəl/', partOfSpeech: 'adjective', translation: '有爭議的', explanation: 'Causing argument and disagreement.', examples: [{ sentence: 'It\'s a controversial topic.', translation: '這是一個有爭議的話題。' }], level: 'B2', tags: ['adjective', 'society'] },
  { word: 'inevitable', pronunciation: '/ɪnˈɛvɪtəbəl/', partOfSpeech: 'adjective', translation: '不可避免的', explanation: 'Certain to happen.', examples: [{ sentence: 'The change was inevitable.', translation: '這個改變是不可避免的。' }], level: 'B2', tags: ['adjective', 'academic'] },
  { word: 'ethical', pronunciation: '/ˈɛθɪkəl/', partOfSpeech: 'adjective', translation: '道德的', explanation: 'Relating to moral principles.', examples: [{ sentence: 'Is this an ethical choice?', translation: '這是一個道德的選擇嗎？' }], level: 'B2', tags: ['adjective', 'society'] },
  { word: 'intellectual', pronunciation: '/ˌɪntɪˈlɛktʃuəl/', partOfSpeech: 'adjective', translation: '智力的；有學識的', explanation: 'Relating to the intellect or knowledge.', examples: [{ sentence: 'She has intellectual curiosity.', translation: '她有求知慾。' }], level: 'B2', tags: ['adjective', 'academic'] },
  { word: 'prejudiced', pronunciation: '/ˈprɛdʒʊdɪst/', partOfSpeech: 'adjective', translation: '有偏見的', explanation: 'Having a bias against something.', examples: [{ sentence: 'Don\'t be prejudiced.', translation: '不要有偏見。' }], level: 'B2', tags: ['adjective', 'society'] },
  { word: 'objective', pronunciation: '/əbˈdʒɛktɪv/', partOfSpeech: 'adjective', translation: '客觀的', explanation: 'Not influenced by personal feelings.', examples: [{ sentence: 'Try to be objective.', translation: '試著保持客觀。' }], level: 'B2', tags: ['adjective', 'academic'] },
  { word: 'subjective', pronunciation: '/səbˈdʒɛktɪv/', partOfSpeech: 'adjective', translation: '主觀的', explanation: 'Based on personal feelings.', examples: [{ sentence: 'Art is very subjective.', translation: '藝術非常主觀。' }], level: 'B2', tags: ['adjective', 'academic'] },

  // ===== B2 - Science =====
  { word: 'atom', pronunciation: '/ˈætəm/', partOfSpeech: 'noun', translation: '原子', explanation: 'The smallest unit of matter.', examples: [{ sentence: 'An atom is incredibly tiny.', translation: '原子非常微小。' }], level: 'B2', tags: ['science'] },
  { word: 'molecule', pronunciation: '/ˈmɒlɪkjuːl/', partOfSpeech: 'noun', translation: '分子', explanation: 'A group of atoms bonded together.', examples: [{ sentence: 'Water is made of molecules.', translation: '水是由分子組成的。' }], level: 'B2', tags: ['science'] },
  { word: 'gravity', pronunciation: '/ˈɡrævɪti/', partOfSpeech: 'noun', translation: '重力', explanation: 'The force that attracts objects toward earth.', examples: [{ sentence: 'Gravity keeps us on the ground.', translation: '重力讓我們留在地面上。' }], level: 'B2', tags: ['science'] },
  { word: 'oxygen', pronunciation: '/ˈɒksɪdʒən/', partOfSpeech: 'noun', translation: '氧氣', explanation: 'A gas essential for life.', examples: [{ sentence: 'Plants produce oxygen.', translation: '植物產生氧氣。' }], level: 'B2', tags: ['science', 'nature'] },
  { word: 'evolution', pronunciation: '/ˌiːvəˈluːʃən/', partOfSpeech: 'noun', translation: '進化；演化', explanation: 'The gradual development of species.', examples: [{ sentence: 'Darwin studied evolution.', translation: '達爾文研究了進化論。' }], level: 'B2', tags: ['science'] },
  { word: 'genetic', pronunciation: '/dʒɪˈnɛtɪk/', partOfSpeech: 'adjective', translation: '遺傳的', explanation: 'Relating to genes or inherited traits.', examples: [{ sentence: 'Some diseases are genetic.', translation: '有些疾病是遺傳性的。' }], level: 'B2', tags: ['science', 'health'] },
  { word: 'radiation', pronunciation: '/ˌreɪdiˈeɪʃən/', partOfSpeech: 'noun', translation: '輻射', explanation: 'Energy transmitted as waves.', examples: [{ sentence: 'Radiation can be dangerous.', translation: '輻射可能很危險。' }], level: 'B2', tags: ['science'] },
  { word: 'solar', pronunciation: '/ˈsoʊlər/', partOfSpeech: 'adjective', translation: '太陽的', explanation: 'Relating to the sun.', examples: [{ sentence: 'Solar energy is clean.', translation: '太陽能是清潔能源。' }], level: 'B2', tags: ['science', 'environment'] },
  { word: 'ecosystem', pronunciation: '/ˈiːkoʊˌsɪstəm/', partOfSpeech: 'noun', translation: '生態系統', explanation: 'A community of living things in their environment.', examples: [{ sentence: 'The ecosystem is fragile.', translation: '生態系統很脆弱。' }], level: 'B2', tags: ['science', 'environment', 'nature'] },
  { word: 'antibiotics', pronunciation: '/ˌæntɪbaɪˈɒtɪks/', partOfSpeech: 'noun', translation: '抗生素', explanation: 'Medicine that kills bacteria.', examples: [{ sentence: 'Take antibiotics as prescribed.', translation: '按處方服用抗生素。' }], level: 'B2', tags: ['health', 'science'] },
];

async function run() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
  console.log('✅ MongoDB 連線成功');

  let added = 0, skipped = 0;
  for (const w of newWords) {
    const exists = await Vocabulary.findOne({ word: { $regex: `^${w.word}$`, $options: 'i' } });
    if (exists) { skipped++; continue; }
    await Vocabulary.create(w);
    added++;
  }

  const total = await Vocabulary.countDocuments();
  console.log(`✅ 新增 ${added} 個單字，跳過 ${skipped} 個重複`);
  console.log(`📚 資料庫現有 ${total} 個單字`);
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
