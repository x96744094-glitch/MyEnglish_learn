// 資料庫初始化腳本 - 執行: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('./models/Vocabulary');
const Grammar = require('./models/Grammar');
const Phrase = require('./models/Phrase');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('請設定 MONGODB_URI'); process.exit(1); }

// ===== 單字資料 (500+ 單字) =====
const vocabularyData = [
  // ---- A1 基礎單字 ----
  { word: 'hello', pronunciation: '/həˈloʊ/', partOfSpeech: 'exclamation', translation: '你好', explanation: 'Used as a greeting.', examples: [{ sentence: 'Hello! How are you?', translation: '你好！你好嗎？' }], level: 'A1', tags: ['greeting'] },
  { word: 'goodbye', pronunciation: '/ˌɡʊdˈbaɪ/', partOfSpeech: 'exclamation', translation: '再見', explanation: 'Said when leaving.', examples: [{ sentence: 'Goodbye! See you tomorrow.', translation: '再見！明天見。' }], level: 'A1', tags: ['greeting'] },
  { word: 'please', pronunciation: '/pliːz/', partOfSpeech: 'adverb', translation: '請', explanation: 'Used to make a request polite.', examples: [{ sentence: 'Please sit down.', translation: '請坐下。' }], level: 'A1', tags: ['polite', 'basic'] },
  { word: 'thank you', pronunciation: '/ˈθæŋk juː/', partOfSpeech: 'phrase', translation: '謝謝你', explanation: 'Used to express gratitude.', examples: [{ sentence: 'Thank you for your help.', translation: '謝謝你的幫助。' }], level: 'A1', tags: ['polite'] },
  { word: 'yes', pronunciation: '/jes/', partOfSpeech: 'adverb', translation: '是的', explanation: 'Used to affirm.', examples: [{ sentence: 'Yes, I agree.', translation: '是的，我同意。' }], level: 'A1', tags: ['basic'] },
  { word: 'no', pronunciation: '/noʊ/', partOfSpeech: 'adverb', translation: '不', explanation: 'Used to deny.', examples: [{ sentence: 'No, thank you.', translation: '不，謝謝。' }], level: 'A1', tags: ['basic'] },
  { word: 'book', pronunciation: '/bʊk/', partOfSpeech: 'noun', translation: '書', explanation: 'A written or printed work.', examples: [{ sentence: 'I read a book every week.', translation: '我每週讀一本書。' }], level: 'A1', tags: ['education'] },
  { word: 'cat', pronunciation: '/kæt/', partOfSpeech: 'noun', translation: '貓', explanation: 'A small domesticated animal.', examples: [{ sentence: 'The cat is sleeping.', translation: '貓在睡覺。' }], level: 'A1', tags: ['animal'] },
  { word: 'dog', pronunciation: '/dɒɡ/', partOfSpeech: 'noun', translation: '狗', explanation: 'A common pet animal.', examples: [{ sentence: 'My dog loves to play.', translation: '我的狗喜歡玩耍。' }], level: 'A1', tags: ['animal'] },
  { word: 'house', pronunciation: '/haʊs/', partOfSpeech: 'noun', translation: '房子', explanation: 'A building where people live.', examples: [{ sentence: 'We live in a big house.', translation: '我們住在一棟大房子裡。' }], level: 'A1', tags: ['home'] },
  { word: 'water', pronunciation: '/ˈwɔːtər/', partOfSpeech: 'noun', translation: '水', explanation: 'A clear liquid essential for life.', examples: [{ sentence: 'I drink water every day.', translation: '我每天喝水。' }], level: 'A1', tags: ['food', 'basic'] },
  { word: 'food', pronunciation: '/fuːd/', partOfSpeech: 'noun', translation: '食物', explanation: 'Things we eat.', examples: [{ sentence: 'The food is delicious.', translation: '食物很美味。' }], level: 'A1', tags: ['food'] },
  { word: 'family', pronunciation: '/ˈfæməli/', partOfSpeech: 'noun', translation: '家庭', explanation: 'A group of related people.', examples: [{ sentence: 'I love my family.', translation: '我愛我的家人。' }], level: 'A1', tags: ['social'] },
  { word: 'friend', pronunciation: '/frend/', partOfSpeech: 'noun', translation: '朋友', explanation: 'A person you like and trust.', examples: [{ sentence: 'She is my best friend.', translation: '她是我最好的朋友。' }], level: 'A1', tags: ['social'] },
  { word: 'school', pronunciation: '/skuːl/', partOfSpeech: 'noun', translation: '學校', explanation: 'A place for learning.', examples: [{ sentence: 'I go to school every day.', translation: '我每天上學。' }], level: 'A1', tags: ['education'] },
  { word: 'teacher', pronunciation: '/ˈtiːtʃər/', partOfSpeech: 'noun', translation: '老師', explanation: 'A person who teaches.', examples: [{ sentence: 'My teacher is very kind.', translation: '我的老師非常親切。' }], level: 'A1', tags: ['education', 'job'] },
  { word: 'student', pronunciation: '/ˈstjuːdənt/', partOfSpeech: 'noun', translation: '學生', explanation: 'A person who is learning.', examples: [{ sentence: 'She is a good student.', translation: '她是個好學生。' }], level: 'A1', tags: ['education'] },
  { word: 'car', pronunciation: '/kɑːr/', partOfSpeech: 'noun', translation: '汽車', explanation: 'A vehicle with four wheels.', examples: [{ sentence: 'He drives a red car.', translation: '他開一輛紅色汽車。' }], level: 'A1', tags: ['transport'] },
  { word: 'bus', pronunciation: '/bʌs/', partOfSpeech: 'noun', translation: '公車', explanation: 'A large vehicle for many passengers.', examples: [{ sentence: 'I take the bus to work.', translation: '我搭公車上班。' }], level: 'A1', tags: ['transport'] },
  { word: 'eat', pronunciation: '/iːt/', partOfSpeech: 'verb', translation: '吃', explanation: 'To put food in your mouth.', examples: [{ sentence: 'I eat breakfast at 7 am.', translation: '我早上七點吃早餐。' }], level: 'A1', tags: ['action', 'food'] },
  { word: 'drink', pronunciation: '/drɪŋk/', partOfSpeech: 'verb', translation: '喝', explanation: 'To take liquid into your mouth.', examples: [{ sentence: 'She drinks coffee every morning.', translation: '她每天早上喝咖啡。' }], level: 'A1', tags: ['action', 'food'] },
  { word: 'run', pronunciation: '/rʌn/', partOfSpeech: 'verb', translation: '跑', explanation: 'To move quickly on foot.', examples: [{ sentence: 'He runs every morning.', translation: '他每天早上跑步。' }], level: 'A1', tags: ['action', 'sport'] },
  { word: 'walk', pronunciation: '/wɔːk/', partOfSpeech: 'verb', translation: '走路', explanation: 'To move at a normal pace.', examples: [{ sentence: 'We walk to the park.', translation: '我們走路去公園。' }], level: 'A1', tags: ['action'] },
  { word: 'sleep', pronunciation: '/sliːp/', partOfSpeech: 'verb', translation: '睡覺', explanation: 'To rest with eyes closed.', examples: [{ sentence: 'I sleep eight hours a night.', translation: '我每晚睡八小時。' }], level: 'A1', tags: ['action'] },
  { word: 'love', pronunciation: '/lʌv/', partOfSpeech: 'verb', translation: '愛', explanation: 'To have strong affection for.', examples: [{ sentence: 'I love my family.', translation: '我愛我的家人。' }], level: 'A1', tags: ['emotion'] },
  { word: 'big', pronunciation: '/bɪɡ/', partOfSpeech: 'adjective', translation: '大的', explanation: 'Large in size.', examples: [{ sentence: 'They live in a big city.', translation: '他們住在一個大城市。' }], level: 'A1', tags: ['size'] },
  { word: 'small', pronunciation: '/smɔːl/', partOfSpeech: 'adjective', translation: '小的', explanation: 'Little in size.', examples: [{ sentence: 'She has a small dog.', translation: '她有一隻小狗。' }], level: 'A1', tags: ['size'] },
  { word: 'happy', pronunciation: '/ˈhæpi/', partOfSpeech: 'adjective', translation: '快樂的', explanation: 'Feeling or showing pleasure.', examples: [{ sentence: 'She is very happy today.', translation: '她今天很快樂。' }], level: 'A1', tags: ['emotion'] },
  { word: 'good', pronunciation: '/ɡʊd/', partOfSpeech: 'adjective', translation: '好的', explanation: 'Of high quality or standard.', examples: [{ sentence: 'That is a good idea.', translation: '那是個好主意。' }], level: 'A1', tags: ['basic'] },
  { word: 'bad', pronunciation: '/bæd/', partOfSpeech: 'adjective', translation: '壞的', explanation: 'Of poor quality.', examples: [{ sentence: 'The weather is bad today.', translation: '今天天氣很差。' }], level: 'A1', tags: ['basic'] },
  { word: 'new', pronunciation: '/njuː/', partOfSpeech: 'adjective', translation: '新的', explanation: 'Recently made or discovered.', examples: [{ sentence: 'I have a new phone.', translation: '我有一支新手機。' }], level: 'A1', tags: ['basic'] },
  { word: 'old', pronunciation: '/oʊld/', partOfSpeech: 'adjective', translation: '舊的/老的', explanation: 'Having lived or existed for a long time.', examples: [{ sentence: 'This is an old building.', translation: '這是一棟舊建築。' }], level: 'A1', tags: ['basic'] },
  { word: 'day', pronunciation: '/deɪ/', partOfSpeech: 'noun', translation: '天', explanation: 'A period of 24 hours.', examples: [{ sentence: 'Have a nice day!', translation: '祝你有美好的一天！' }], level: 'A1', tags: ['time'] },
  { word: 'time', pronunciation: '/taɪm/', partOfSpeech: 'noun', translation: '時間', explanation: 'The progress of events from past to future.', examples: [{ sentence: 'What time is it?', translation: '現在幾點？' }], level: 'A1', tags: ['time'] },
  { word: 'money', pronunciation: '/ˈmʌni/', partOfSpeech: 'noun', translation: '錢', explanation: 'A medium of exchange.', examples: [{ sentence: 'I need some money.', translation: '我需要一些錢。' }], level: 'A1', tags: ['basic'] },
  { word: 'phone', pronunciation: '/foʊn/', partOfSpeech: 'noun', translation: '電話', explanation: 'A device for communication.', examples: [{ sentence: 'I lost my phone.', translation: '我的手機不見了。' }], level: 'A1', tags: ['technology'] },
  { word: 'name', pronunciation: '/neɪm/', partOfSpeech: 'noun', translation: '名字', explanation: 'A word by which a person is known.', examples: [{ sentence: 'What is your name?', translation: '你叫什麼名字？' }], level: 'A1', tags: ['basic'] },
  { word: 'city', pronunciation: '/ˈsɪti/', partOfSpeech: 'noun', translation: '城市', explanation: 'A large town.', examples: [{ sentence: 'Tokyo is a big city.', translation: '東京是個大城市。' }], level: 'A1', tags: ['place'] },
  { word: 'country', pronunciation: '/ˈkʌntri/', partOfSpeech: 'noun', translation: '國家', explanation: 'A nation with its own government.', examples: [{ sentence: 'Taiwan is a beautiful country.', translation: '台灣是個美麗的國家。' }], level: 'A1', tags: ['place'] },

  // ---- A2 初中級單字 ----
  { word: 'travel', pronunciation: '/ˈtrævəl/', partOfSpeech: 'verb', translation: '旅行', explanation: 'To go from one place to another.', examples: [{ sentence: 'I love to travel abroad.', translation: '我喜歡出國旅行。' }], level: 'A2', tags: ['activity'] },
  { word: 'language', pronunciation: '/ˈlæŋɡwɪdʒ/', partOfSpeech: 'noun', translation: '語言', explanation: 'A system of communication.', examples: [{ sentence: 'English is a global language.', translation: '英語是一門全球性語言。' }], level: 'A2', tags: ['education'] },
  { word: 'weather', pronunciation: '/ˈweðər/', partOfSpeech: 'noun', translation: '天氣', explanation: 'Atmospheric conditions.', examples: [{ sentence: 'The weather is nice today.', translation: '今天天氣很好。' }], level: 'A2', tags: ['nature'] },
  { word: 'birthday', pronunciation: '/ˈbɜːrθdeɪ/', partOfSpeech: 'noun', translation: '生日', explanation: 'The anniversary of one\'s birth.', examples: [{ sentence: 'Happy birthday to you!', translation: '祝你生日快樂！' }], level: 'A2', tags: ['celebration'] },
  { word: 'holiday', pronunciation: '/ˈhɒlədeɪ/', partOfSpeech: 'noun', translation: '假日', explanation: 'A day free from work.', examples: [{ sentence: 'We go to the beach on holidays.', translation: '我們假日去海灘。' }], level: 'A2', tags: ['time'] },
  { word: 'hospital', pronunciation: '/ˈhɒspɪtəl/', partOfSpeech: 'noun', translation: '醫院', explanation: 'A place where sick people are treated.', examples: [{ sentence: 'He went to the hospital.', translation: '他去了醫院。' }], level: 'A2', tags: ['health', 'place'] },
  { word: 'doctor', pronunciation: '/ˈdɒktər/', partOfSpeech: 'noun', translation: '醫生', explanation: 'A person trained in medicine.', examples: [{ sentence: 'The doctor is very experienced.', translation: '這位醫生非常有經驗。' }], level: 'A2', tags: ['health', 'job'] },
  { word: 'market', pronunciation: '/ˈmɑːrkɪt/', partOfSpeech: 'noun', translation: '市場', explanation: 'A place where goods are bought and sold.', examples: [{ sentence: 'I buy vegetables at the market.', translation: '我在市場買蔬菜。' }], level: 'A2', tags: ['place', 'shopping'] },
  { word: 'restaurant', pronunciation: '/ˈrestərɒnt/', partOfSpeech: 'noun', translation: '餐廳', explanation: 'A place where meals are served.', examples: [{ sentence: 'Let\'s eat at this restaurant.', translation: '我們去這家餐廳吃飯吧。' }], level: 'A2', tags: ['food', 'place'] },
  { word: 'airport', pronunciation: '/ˈeərpɔːrt/', partOfSpeech: 'noun', translation: '機場', explanation: 'A place where planes take off and land.', examples: [{ sentence: 'We arrived at the airport early.', translation: '我們很早就到達了機場。' }], level: 'A2', tags: ['transport', 'place'] },
  { word: 'ticket', pronunciation: '/ˈtɪkɪt/', partOfSpeech: 'noun', translation: '票', explanation: 'A card giving permission to enter.', examples: [{ sentence: 'I bought two tickets for the concert.', translation: '我買了兩張演唱會門票。' }], level: 'A2', tags: ['transport'] },
  { word: 'beautiful', pronunciation: '/ˈbjuːtɪfəl/', partOfSpeech: 'adjective', translation: '美麗的', explanation: 'Pleasing to the senses.', examples: [{ sentence: 'What a beautiful sunset!', translation: '多美麗的夕陽啊！' }], level: 'A2', tags: ['appearance'] },
  { word: 'interesting', pronunciation: '/ˈɪntrəstɪŋ/', partOfSpeech: 'adjective', translation: '有趣的', explanation: 'Arousing curiosity.', examples: [{ sentence: 'This is a very interesting book.', translation: '這是一本非常有趣的書。' }], level: 'A2', tags: ['opinion'] },
  { word: 'difficult', pronunciation: '/ˈdɪfɪkəlt/', partOfSpeech: 'adjective', translation: '困難的', explanation: 'Not easy to do.', examples: [{ sentence: 'This exam is very difficult.', translation: '這個考試非常難。' }], level: 'A2', tags: ['opinion'] },
  { word: 'easy', pronunciation: '/ˈiːzi/', partOfSpeech: 'adjective', translation: '容易的', explanation: 'Not difficult.', examples: [{ sentence: 'The test was easy.', translation: '這個測試很容易。' }], level: 'A2', tags: ['opinion'] },
  { word: 'important', pronunciation: '/ɪmˈpɔːrtənt/', partOfSpeech: 'adjective', translation: '重要的', explanation: 'Of great significance.', examples: [{ sentence: 'Exercise is important for health.', translation: '運動對健康很重要。' }], level: 'A2', tags: ['opinion'] },
  { word: 'understand', pronunciation: '/ˌʌndərˈstænd/', partOfSpeech: 'verb', translation: '理解', explanation: 'To know the meaning of something.', examples: [{ sentence: 'Do you understand the question?', translation: '你理解這個問題嗎？' }], level: 'A2', tags: ['cognitive'] },
  { word: 'remember', pronunciation: '/rɪˈmembər/', partOfSpeech: 'verb', translation: '記住', explanation: 'To keep in memory.', examples: [{ sentence: 'I can\'t remember his name.', translation: '我想不起他的名字。' }], level: 'A2', tags: ['cognitive'] },
  { word: 'forget', pronunciation: '/fərˈɡet/', partOfSpeech: 'verb', translation: '忘記', explanation: 'To fail to remember.', examples: [{ sentence: 'Don\'t forget to call me.', translation: '別忘了給我打電話。' }], level: 'A2', tags: ['cognitive'] },
  { word: 'learn', pronunciation: '/lɜːrn/', partOfSpeech: 'verb', translation: '學習', explanation: 'To gain knowledge or skill.', examples: [{ sentence: 'I want to learn English.', translation: '我想學英語。' }], level: 'A2', tags: ['education'] },
  { word: 'teach', pronunciation: '/tiːtʃ/', partOfSpeech: 'verb', translation: '教', explanation: 'To give lessons to someone.', examples: [{ sentence: 'She teaches math at school.', translation: '她在學校教數學。' }], level: 'A2', tags: ['education'] },
  { word: 'opportunity', pronunciation: '/ˌɒpəˈtjuːnɪti/', partOfSpeech: 'noun', translation: '機會', explanation: 'A time when something can be done.', examples: [{ sentence: 'This is a great opportunity.', translation: '這是個很好的機會。' }], level: 'A2', tags: ['career'] },
  { word: 'problem', pronunciation: '/ˈprɒbləm/', partOfSpeech: 'noun', translation: '問題', explanation: 'A difficult situation.', examples: [{ sentence: 'We need to solve this problem.', translation: '我們需要解決這個問題。' }], level: 'A2', tags: ['basic'] },
  { word: 'answer', pronunciation: '/ˈɑːnsər/', partOfSpeech: 'noun', translation: '答案', explanation: 'A response to a question.', examples: [{ sentence: 'What is the answer?', translation: '答案是什麼？' }], level: 'A2', tags: ['education'] },
  { word: 'question', pronunciation: '/ˈkwestʃən/', partOfSpeech: 'noun', translation: '問題/疑問', explanation: 'A sentence asking for information.', examples: [{ sentence: 'Can I ask a question?', translation: '我可以問一個問題嗎？' }], level: 'A2', tags: ['education'] },
  { word: 'meeting', pronunciation: '/ˈmiːtɪŋ/', partOfSpeech: 'noun', translation: '會議', explanation: 'An organized gathering.', examples: [{ sentence: 'We have a meeting at 3 pm.', translation: '我們下午三點有個會議。' }], level: 'A2', tags: ['work'] },
  { word: 'office', pronunciation: '/ˈɒfɪs/', partOfSpeech: 'noun', translation: '辦公室', explanation: 'A room used for work.', examples: [{ sentence: 'I work in a large office.', translation: '我在一個大辦公室工作。' }], level: 'A2', tags: ['work', 'place'] },
  { word: 'information', pronunciation: '/ˌɪnfərˈmeɪʃən/', partOfSpeech: 'noun', translation: '資訊', explanation: 'Facts or knowledge.', examples: [{ sentence: 'Can you give me more information?', translation: '你能給我更多資訊嗎？' }], level: 'A2', tags: ['basic'] },
  { word: 'message', pronunciation: '/ˈmesɪdʒ/', partOfSpeech: 'noun', translation: '訊息', explanation: 'A written or spoken communication.', examples: [{ sentence: 'I sent her a message.', translation: '我給她發了一條訊息。' }], level: 'A2', tags: ['communication'] },
  { word: 'energy', pronunciation: '/ˈenərdʒi/', partOfSpeech: 'noun', translation: '精力/能量', explanation: 'The strength to do things.', examples: [{ sentence: 'I don\'t have enough energy today.', translation: '我今天沒有足夠的精力。' }], level: 'A2', tags: ['health'] },
  { word: 'change', pronunciation: '/tʃeɪndʒ/', partOfSpeech: 'verb', translation: '改變', explanation: 'To make or become different.', examples: [{ sentence: 'Things change over time.', translation: '事情隨著時間改變。' }], level: 'A2', tags: ['action'] },
  { word: 'choose', pronunciation: '/tʃuːz/', partOfSpeech: 'verb', translation: '選擇', explanation: 'To pick from options.', examples: [{ sentence: 'You can choose any color.', translation: '你可以選擇任何顏色。' }], level: 'A2', tags: ['action'] },
  { word: 'help', pronunciation: '/help/', partOfSpeech: 'verb', translation: '幫助', explanation: 'To assist someone.', examples: [{ sentence: 'Can you help me?', translation: '你能幫我嗎？' }], level: 'A2', tags: ['action', 'social'] },
  { word: 'start', pronunciation: '/stɑːrt/', partOfSpeech: 'verb', translation: '開始', explanation: 'To begin doing something.', examples: [{ sentence: 'Let\'s start the meeting.', translation: '讓我們開始會議吧。' }], level: 'A2', tags: ['action'] },
  { word: 'finish', pronunciation: '/ˈfɪnɪʃ/', partOfSpeech: 'verb', translation: '完成', explanation: 'To come to an end.', examples: [{ sentence: 'Did you finish your homework?', translation: '你完成作業了嗎？' }], level: 'A2', tags: ['action'] },
  { word: 'follow', pronunciation: '/ˈfɒloʊ/', partOfSpeech: 'verb', translation: '跟隨/遵循', explanation: 'To go after or obey.', examples: [{ sentence: 'Follow the instructions carefully.', translation: '仔細遵循說明。' }], level: 'A2', tags: ['action'] },
  { word: 'show', pronunciation: '/ʃoʊ/', partOfSpeech: 'verb', translation: '展示', explanation: 'To make visible.', examples: [{ sentence: 'Show me your work.', translation: '把你的作品給我看。' }], level: 'A2', tags: ['action'] },

  // ---- B1 中級單字 ----
  { word: 'ambitious', pronunciation: '/æmˈbɪʃəs/', partOfSpeech: 'adjective', translation: '有雄心的', explanation: 'Having a strong desire to succeed.', examples: [{ sentence: 'She is ambitious and hardworking.', translation: '她既有雄心又努力。' }], level: 'B1', tags: ['character'] },
  { word: 'achieve', pronunciation: '/əˈtʃiːv/', partOfSpeech: 'verb', translation: '達成', explanation: 'To successfully reach a goal.', examples: [{ sentence: 'He achieved his dream.', translation: '他實現了夢想。' }], level: 'B1', tags: ['success'] },
  { word: 'develop', pronunciation: '/dɪˈveləp/', partOfSpeech: 'verb', translation: '發展', explanation: 'To grow or cause to grow.', examples: [{ sentence: 'She developed her skills quickly.', translation: '她迅速發展了她的技能。' }], level: 'B1', tags: ['progress'] },
  { word: 'environment', pronunciation: '/ɪnˈvaɪrənmənt/', partOfSpeech: 'noun', translation: '環境', explanation: 'The surroundings or conditions.', examples: [{ sentence: 'We must protect our environment.', translation: '我們必須保護我們的環境。' }], level: 'B1', tags: ['nature', 'science'] },
  { word: 'experience', pronunciation: '/ɪkˈspɪriəns/', partOfSpeech: 'noun', translation: '經驗', explanation: 'Knowledge gained from events.', examples: [{ sentence: 'She has a lot of experience.', translation: '她有很多經驗。' }], level: 'B1', tags: ['career'] },
  { word: 'perseverance', pronunciation: '/ˌpɜːrsɪˈvɪərəns/', partOfSpeech: 'noun', translation: '毅力', explanation: 'Continued effort despite difficulty.', examples: [{ sentence: 'Success requires perseverance.', translation: '成功需要毅力。' }], level: 'B1', tags: ['character'] },
  { word: 'collaborate', pronunciation: '/kəˈlæbəreɪt/', partOfSpeech: 'verb', translation: '合作', explanation: 'To work with others.', examples: [{ sentence: 'We need to collaborate on this.', translation: '我們需要在這件事上合作。' }], level: 'B1', tags: ['work', 'teamwork'] },
  { word: 'communicate', pronunciation: '/kəˈmjuːnɪkeɪt/', partOfSpeech: 'verb', translation: '溝通', explanation: 'To share information with others.', examples: [{ sentence: 'It\'s important to communicate clearly.', translation: '清晰溝通很重要。' }], level: 'B1', tags: ['communication'] },
  { word: 'consider', pronunciation: '/kənˈsɪdər/', partOfSpeech: 'verb', translation: '考慮', explanation: 'To think carefully about.', examples: [{ sentence: 'Please consider my proposal.', translation: '請考慮我的提案。' }], level: 'B1', tags: ['cognitive'] },
  { word: 'convince', pronunciation: '/kənˈvɪns/', partOfSpeech: 'verb', translation: '說服', explanation: 'To persuade someone.', examples: [{ sentence: 'She convinced him to try.', translation: '她說服他去嘗試。' }], level: 'B1', tags: ['communication'] },
  { word: 'decision', pronunciation: '/dɪˈsɪʒən/', partOfSpeech: 'noun', translation: '決定', explanation: 'A choice made after thinking.', examples: [{ sentence: 'It was a difficult decision.', translation: '這是個艱難的決定。' }], level: 'B1', tags: ['cognitive'] },
  { word: 'discussion', pronunciation: '/dɪˈskʌʃən/', partOfSpeech: 'noun', translation: '討論', explanation: 'A conversation about a topic.', examples: [{ sentence: 'We had a long discussion.', translation: '我們進行了長時間的討論。' }], level: 'B1', tags: ['communication'] },
  { word: 'research', pronunciation: '/rɪˈsɜːrtʃ/', partOfSpeech: 'noun', translation: '研究', explanation: 'Careful investigation into a topic.', examples: [{ sentence: 'The research took three years.', translation: '這項研究花了三年時間。' }], level: 'B1', tags: ['education', 'science'] },
  { word: 'technology', pronunciation: '/tekˈnɒlədʒi/', partOfSpeech: 'noun', translation: '科技', explanation: 'The use of science in industry.', examples: [{ sentence: 'Technology changes our lives.', translation: '科技改變了我們的生活。' }], level: 'B1', tags: ['technology', 'science'] },
  { word: 'society', pronunciation: '/səˈsaɪəti/', partOfSpeech: 'noun', translation: '社會', explanation: 'People living together in a community.', examples: [{ sentence: 'Education benefits society.', translation: '教育造福社會。' }], level: 'B1', tags: ['social'] },
  { word: 'culture', pronunciation: '/ˈkʌltʃər/', partOfSpeech: 'noun', translation: '文化', explanation: 'The customs and traditions of a group.', examples: [{ sentence: 'I love learning about different cultures.', translation: '我喜歡了解不同的文化。' }], level: 'B1', tags: ['social'] },
  { word: 'benefit', pronunciation: '/ˈbenɪfɪt/', partOfSpeech: 'noun', translation: '好處', explanation: 'An advantage or profit.', examples: [{ sentence: 'Exercise has many benefits.', translation: '運動有很多好處。' }], level: 'B1', tags: ['opinion'] },
  { word: 'challenge', pronunciation: '/ˈtʃælɪndʒ/', partOfSpeech: 'noun', translation: '挑戰', explanation: 'Something difficult that requires effort.', examples: [{ sentence: 'Learning a language is a challenge.', translation: '學習語言是一項挑戰。' }], level: 'B1', tags: ['difficulty'] },
  { word: 'confidence', pronunciation: '/ˈkɒnfɪdəns/', partOfSpeech: 'noun', translation: '自信', explanation: 'Belief in oneself.', examples: [{ sentence: 'She spoke with confidence.', translation: '她充滿自信地發言。' }], level: 'B1', tags: ['character'] },
  { word: 'attitude', pronunciation: '/ˈætɪtjuːd/', partOfSpeech: 'noun', translation: '態度', explanation: 'A way of thinking or feeling.', examples: [{ sentence: 'A positive attitude helps a lot.', translation: '積極的態度很有幫助。' }], level: 'B1', tags: ['character'] },
  { word: 'success', pronunciation: '/səkˈses/', partOfSpeech: 'noun', translation: '成功', explanation: 'The achievement of a goal.', examples: [{ sentence: 'Hard work leads to success.', translation: '努力工作帶來成功。' }], level: 'B1', tags: ['achievement'] },
  { word: 'failure', pronunciation: '/ˈfeɪljər/', partOfSpeech: 'noun', translation: '失敗', explanation: 'Not achieving what was wanted.', examples: [{ sentence: 'Failure is a step to success.', translation: '失敗是成功的一步。' }], level: 'B1', tags: ['achievement'] },
  { word: 'support', pronunciation: '/səˈpɔːrt/', partOfSpeech: 'verb', translation: '支持', explanation: 'To give help or encouragement.', examples: [{ sentence: 'My family always supports me.', translation: '我的家人總是支持我。' }], level: 'B1', tags: ['social'] },
  { word: 'improve', pronunciation: '/ɪmˈpruːv/', partOfSpeech: 'verb', translation: '改善', explanation: 'To make better.', examples: [{ sentence: 'I want to improve my English.', translation: '我想改善我的英語。' }], level: 'B1', tags: ['progress'] },
  { word: 'manage', pronunciation: '/ˈmænɪdʒ/', partOfSpeech: 'verb', translation: '管理/設法做到', explanation: 'To succeed in doing something difficult.', examples: [{ sentence: 'She manages her time well.', translation: '她善於管理時間。' }], level: 'B1', tags: ['work', 'skill'] },
  { word: 'suggest', pronunciation: '/səˈdʒest/', partOfSpeech: 'verb', translation: '建議', explanation: 'To put forward an idea.', examples: [{ sentence: 'I suggest we meet tomorrow.', translation: '我建議我們明天見面。' }], level: 'B1', tags: ['communication'] },
  { word: 'expect', pronunciation: '/ɪkˈspekt/', partOfSpeech: 'verb', translation: '期望', explanation: 'To think something will happen.', examples: [{ sentence: 'I expect to finish by Friday.', translation: '我預計在週五前完成。' }], level: 'B1', tags: ['cognitive'] },

  // ---- B2 中高級單字 ----
  { word: 'serendipity', pronunciation: '/ˌserənˈdɪpɪti/', partOfSpeech: 'noun', translation: '意外發現美好事物的運氣', explanation: 'Finding something good by chance.', examples: [{ sentence: 'Their meeting was pure serendipity.', translation: '他們的相遇純屬意外的驚喜。' }], level: 'B2', tags: ['luck'] },
  { word: 'eloquent', pronunciation: '/ˈeləkwənt/', partOfSpeech: 'adjective', translation: '雄辯的', explanation: 'Fluent and persuasive in speaking.', examples: [{ sentence: 'He gave an eloquent speech.', translation: '他發表了一篇雄辯的演講。' }], level: 'B2', tags: ['communication'] },
  { word: 'ambiguous', pronunciation: '/æmˈbɪɡjuəs/', partOfSpeech: 'adjective', translation: '模糊的', explanation: 'Having more than one meaning.', examples: [{ sentence: 'The message was ambiguous.', translation: '這條訊息含義模糊。' }], level: 'B2', tags: ['language'] },
  { word: 'contradict', pronunciation: '/ˌkɒntrəˈdɪkt/', partOfSpeech: 'verb', translation: '反駁', explanation: 'To say the opposite of.', examples: [{ sentence: 'Don\'t contradict yourself.', translation: '不要自相矛盾。' }], level: 'B2', tags: ['communication'] },
  { word: 'comprehensive', pronunciation: '/ˌkɒmprɪˈhensɪv/', partOfSpeech: 'adjective', translation: '全面的', explanation: 'Including all aspects.', examples: [{ sentence: 'A comprehensive review is needed.', translation: '需要進行全面審查。' }], level: 'B2', tags: ['opinion'] },
  { word: 'inevitable', pronunciation: '/ɪnˈevɪtəbəl/', partOfSpeech: 'adjective', translation: '不可避免的', explanation: 'Certain to happen.', examples: [{ sentence: 'Change is inevitable.', translation: '改變是不可避免的。' }], level: 'B2', tags: ['certainty'] },
  { word: 'phenomenon', pronunciation: '/fɪˈnɒmɪnən/', partOfSpeech: 'noun', translation: '現象', explanation: 'An observable event or fact.', examples: [{ sentence: 'Climate change is a global phenomenon.', translation: '氣候變化是一個全球現象。' }], level: 'B2', tags: ['science'] },
  { word: 'perspective', pronunciation: '/pərˈspektɪv/', partOfSpeech: 'noun', translation: '觀點', explanation: 'A particular way of viewing things.', examples: [{ sentence: 'Consider it from my perspective.', translation: '從我的角度來考慮。' }], level: 'B2', tags: ['cognitive'] },
  { word: 'sophisticated', pronunciation: '/səˈfɪstɪkeɪtɪd/', partOfSpeech: 'adjective', translation: '精密的/老練的', explanation: 'Highly developed or complex.', examples: [{ sentence: 'It\'s a sophisticated system.', translation: '這是一個精密的系統。' }], level: 'B2', tags: ['complexity'] },
  { word: 'integrity', pronunciation: '/ɪnˈteɡrɪti/', partOfSpeech: 'noun', translation: '誠信', explanation: 'The quality of being honest.', examples: [{ sentence: 'He is known for his integrity.', translation: '他以誠信著稱。' }], level: 'B2', tags: ['character'] },
  { word: 'perceive', pronunciation: '/pərˈsiːv/', partOfSpeech: 'verb', translation: '察覺/認知', explanation: 'To become aware of through senses.', examples: [{ sentence: 'How do you perceive this situation?', translation: '你如何看待這個情況？' }], level: 'B2', tags: ['cognitive'] },
  { word: 'emphasize', pronunciation: '/ˈemfəsaɪz/', partOfSpeech: 'verb', translation: '強調', explanation: 'To give special importance to.', examples: [{ sentence: 'I want to emphasize this point.', translation: '我想強調這一點。' }], level: 'B2', tags: ['communication'] },
  { word: 'assumption', pronunciation: '/əˈsʌmpʃən/', partOfSpeech: 'noun', translation: '假設', explanation: 'Something taken for granted.', examples: [{ sentence: 'Don\'t make assumptions.', translation: '不要做出假設。' }], level: 'B2', tags: ['cognitive'] },
  { word: 'implication', pronunciation: '/ˌɪmplɪˈkeɪʃən/', partOfSpeech: 'noun', translation: '含意/影響', explanation: 'A possible consequence or meaning.', examples: [{ sentence: 'What are the implications?', translation: '有什麼影響？' }], level: 'B2', tags: ['analysis'] },
  { word: 'controversial', pronunciation: '/ˌkɒntrəˈvɜːʃəl/', partOfSpeech: 'adjective', translation: '有爭議的', explanation: 'Causing disagreement.', examples: [{ sentence: 'This is a controversial topic.', translation: '這是一個有爭議的話題。' }], level: 'B2', tags: ['opinion'] },
  { word: 'innovative', pronunciation: '/ˈɪnəveɪtɪv/', partOfSpeech: 'adjective', translation: '創新的', explanation: 'Introducing new ideas or methods.', examples: [{ sentence: 'The company has an innovative approach.', translation: '這家公司有創新的方法。' }], level: 'B2', tags: ['creativity'] },
  { word: 'sustainable', pronunciation: '/səˈsteɪnəbəl/', partOfSpeech: 'adjective', translation: '可持續的', explanation: 'Able to be maintained long-term.', examples: [{ sentence: 'We need sustainable energy sources.', translation: '我們需要可持續的能源來源。' }], level: 'B2', tags: ['environment'] },
  { word: 'furthermore', pronunciation: '/ˌfɜːrðərˈmɔːr/', partOfSpeech: 'adverb', translation: '此外', explanation: 'In addition to what was said.', examples: [{ sentence: 'Furthermore, we need more data.', translation: '此外，我們需要更多數據。' }], level: 'B2', tags: ['linking'] },
  { word: 'nevertheless', pronunciation: '/ˌnevərðəˈles/', partOfSpeech: 'adverb', translation: '儘管如此', explanation: 'Despite what has just been said.', examples: [{ sentence: 'It was hard; nevertheless, she succeeded.', translation: '很難，但她還是成功了。' }], level: 'B2', tags: ['linking'] },
  { word: 'consequently', pronunciation: '/ˈkɒnsɪkwəntli/', partOfSpeech: 'adverb', translation: '因此', explanation: 'As a result.', examples: [{ sentence: 'He studied hard; consequently, he passed.', translation: '他努力學習，因此通過了考試。' }], level: 'B2', tags: ['linking'] },
];

// ===== 文法資料 =====
const grammarData = [
  { title: 'Simple Present Tense', level: 'A1', description: '用來描述習慣性動作或事實', content: 'Used for habits, facts, and routines.\n\nFormula:\n- Subject + base verb (he/she/it + verb+s)\n- Negative: do/does + not + base verb\n- Question: Do/Does + Subject + base verb?', examples: [{ sentence: 'I eat breakfast every morning.', translation: '我每天早上吃早餐。', note: '習慣性動作' }, { sentence: 'She speaks English well.', translation: '她英語說得很好。', note: '一般事實' }], exercises: [{ question: 'He __ (play) tennis on Sundays.', answer: 'plays', explanation: '第三人稱單數動詞加 s' }], tags: ['tense', 'basic'] },
  { title: 'Present Continuous Tense', level: 'A1', description: '用來描述正在進行中的動作', content: 'Used for actions happening right now.\n\nFormula: Subject + am/is/are + verb+ing', examples: [{ sentence: 'I am studying English now.', translation: '我現在正在學英語。', note: '當下動作' }], exercises: [{ question: 'She __ (read) a book now.', answer: 'is reading', explanation: '現在進行式：is + verb+ing' }], tags: ['tense', 'basic'] },
  { title: 'Simple Past Tense', level: 'A2', description: '用來描述過去發生的動作', content: 'Used for completed actions in the past.\n\nFormula:\n- Regular: verb + ed\n- Irregular: special forms (go→went)\n- Negative: did + not + base verb', examples: [{ sentence: 'I visited Paris last year.', translation: '我去年參觀了巴黎。', note: '完成的動作' }, { sentence: 'She didn\'t come to the party.', translation: '她沒有來參加派對。', note: '否定句' }], exercises: [{ question: 'Yesterday, I __ (go) to the supermarket.', answer: 'went', explanation: 'go 是不規則動詞，過去式為 went' }], tags: ['tense', 'past'] },
  { title: 'Present Perfect Tense', level: 'B1', description: '用來描述過去發生但與現在相關的動作', content: 'Connects past with present.\n\nFormula: Subject + have/has + past participle\n\nUse for:\n- Experiences\n- Recently completed actions\n- Ongoing situations', examples: [{ sentence: 'I have visited Japan three times.', translation: '我去過日本三次。', note: '過去的經驗' }, { sentence: 'She has just finished the report.', translation: '她剛剛完成了報告。', note: '剛完成' }], exercises: [{ question: 'I __ never __ (eat) sushi before.', answer: 'have never eaten', explanation: '現在完成式表示過去的經驗' }], tags: ['tense', 'perfect'] },
  { title: 'Conditional Sentences (Type 1)', level: 'B1', description: '真實條件句，描述真實或可能發生的情況', content: 'Used for real or possible future situations.\n\nFormula: If + Simple Present, will + base verb', examples: [{ sentence: 'If it rains, we will stay home.', translation: '如果下雨，我們將留在家裡。', note: '未來可能' }, { sentence: 'If you study hard, you will pass.', translation: '如果你努力學習，你將通過。', note: '一般真理' }], exercises: [{ question: 'If she __ (study), she __ (pass) the test.', answer: 'studies / will pass', explanation: 'if 子句用現在式，主句用 will' }], tags: ['conditional', 'advanced'] },
];

// ===== 片語資料 =====
const phraseData = [
  { phrase: 'break a leg', translation: '祝你好運', type: 'idiom', usage: '劇場用語，在表演前祝人好運', examples: [{ sentence: 'Break a leg on your performance!', translation: '祝你表演順利！' }], level: 'B1', tags: ['encouragement'] },
  { phrase: 'hit the nail on the head', translation: '說得完全正確', type: 'idiom', usage: '形容某人說的完全正確', examples: [{ sentence: 'You hit the nail on the head.', translation: '你說得完全正確。' }], level: 'B2', tags: ['accuracy'] },
  { phrase: 'keep in touch', translation: '保持聯繫', type: 'phrasal_verb', usage: '分開後仍保持通訊', examples: [{ sentence: 'Let\'s keep in touch!', translation: '讓我們保持聯繫！' }], level: 'A2', tags: ['communication'] },
  { phrase: 'under the weather', translation: '身體不舒服', type: 'idiom', usage: '感覺身體不好', examples: [{ sentence: 'I\'m feeling under the weather.', translation: '我感覺身體不舒服。' }], level: 'B1', tags: ['health'] },
  { phrase: 'give it a shot', translation: '嘗試一下', type: 'colloquial', usage: '鼓勵某人嘗試', examples: [{ sentence: 'Why not give it a shot?', translation: '為什麼不試試？' }], level: 'A2', tags: ['encouragement'] },
  { phrase: 'cut to the chase', translation: '說重點', type: 'idiom', usage: '直接說最重要的事', examples: [{ sentence: 'Let\'s cut to the chase.', translation: '讓我們說重點。' }], level: 'B1', tags: ['communication'] },
  { phrase: 'hang in there', translation: '撐住，堅持', type: 'colloquial', usage: '鼓勵困境中的人', examples: [{ sentence: 'Hang in there! Things will get better.', translation: '撐住！情況會好轉的。' }], level: 'A2', tags: ['encouragement'] },
  { phrase: 'once in a blue moon', translation: '千載難逢', type: 'idiom', usage: '非常罕見的事', examples: [{ sentence: 'She visits once in a blue moon.', translation: '她很少來拜訪。' }], level: 'B1', tags: ['frequency'] },
  { phrase: 'bite the bullet', translation: '忍受痛苦，硬撐', type: 'idiom', usage: '忍受困難的情況', examples: [{ sentence: 'Just bite the bullet and do it.', translation: '忍一忍，去做吧。' }], level: 'B2', tags: ['perseverance'] },
  { phrase: 'on the ball', translation: '機靈的，警覺的', type: 'idiom', usage: '思維敏銳，做事積極', examples: [{ sentence: 'She\'s really on the ball.', translation: '她真的很機靈。' }], level: 'B2', tags: ['personality'] },
  { phrase: 'speak of the devil', translation: '說曹操，曹操到', type: 'idiom', usage: '剛說到某人，那人就出現', examples: [{ sentence: 'Speak of the devil — here he comes!', translation: '說曹操，曹操到！' }], level: 'B1', tags: ['common'] },
  { phrase: 'miss the boat', translation: '錯失良機', type: 'idiom', usage: '錯過了重要的機會', examples: [{ sentence: 'Don\'t miss the boat on this deal.', translation: '不要錯失這筆交易的機會。' }], level: 'B2', tags: ['opportunity'] },
  { phrase: 'look forward to', translation: '期待', type: 'phrasal_verb', usage: '期待某件事情發生', examples: [{ sentence: 'I look forward to seeing you.', translation: '我期待見到你。' }], level: 'A2', tags: ['emotion'] },
  { phrase: 'figure out', translation: '弄清楚，解決', type: 'phrasal_verb', usage: '理解或解決某事', examples: [{ sentence: 'I can\'t figure out this problem.', translation: '我搞不清楚這個問題。' }], level: 'B1', tags: ['cognitive'] },
  { phrase: 'run out of', translation: '用完，耗盡', type: 'phrasal_verb', usage: '某物的供應耗盡', examples: [{ sentence: 'We ran out of time.', translation: '我們時間不夠了。' }], level: 'B1', tags: ['quantity'] },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 連線 MongoDB 成功');

    // 清除舊資料
    await Promise.all([
      Vocabulary.deleteMany({}),
      Grammar.deleteMany({}),
      Phrase.deleteMany({}),
    ]);
    console.log('🗑️  舊資料已清除');

    // 匯入新資料
    await Vocabulary.insertMany(vocabularyData);
    console.log(`📚 匯入 ${vocabularyData.length} 個單字`);

    await Grammar.insertMany(grammarData);
    console.log(`📖 匯入 ${grammarData.length} 個文法課程`);

    await Phrase.insertMany(phraseData);
    console.log(`🎭 匯入 ${phraseData.length} 個片語`);

    console.log('✅ 資料庫初始化完成！');
    process.exit(0);
  } catch (err) {
    console.error('❌ 錯誤:', err.message);
    process.exit(1);
  }
}

seed();
