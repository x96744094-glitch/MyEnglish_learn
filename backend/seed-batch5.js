// 第五批次 - 補充更多常用單字 - 執行: node seed-batch5.js
require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('./models/Vocabulary');

const MONGODB_URI = (process.env.MONGODB_URI || '').trim().replace(/ㄦ/g, '-');
if (!MONGODB_URI) { console.error('請設定 MONGODB_URI'); process.exit(1); }

const newWords = [
  // ===== A2 - City & Places =====
  { word: 'bank', pronunciation: '/bæŋk/', partOfSpeech: 'noun', translation: '銀行', explanation: 'A financial institution for saving money.', examples: [{ sentence: 'I need to go to the bank.', translation: '我需要去銀行。' }], level: 'A2', tags: ['place', 'money'] },
  { word: 'restaurant', pronunciation: '/ˈrɛstərɒnt/', partOfSpeech: 'noun', translation: '餐廳', explanation: 'A place where meals are served.', examples: [{ sentence: 'Let\'s eat at a restaurant.', translation: '我們去餐廳吃飯吧。' }], level: 'A2', tags: ['place', 'food'] },
  { word: 'pharmacy', pronunciation: '/ˈfɑːrməsi/', partOfSpeech: 'noun', translation: '藥局', explanation: 'A place where medicines are sold.', examples: [{ sentence: 'Buy the medicine at the pharmacy.', translation: '在藥局買藥。' }], level: 'A2', tags: ['place', 'health'] },
  { word: 'library', pronunciation: '/ˈlaɪbrəri/', partOfSpeech: 'noun', translation: '圖書館', explanation: 'A place where books are kept.', examples: [{ sentence: 'I study at the library.', translation: '我在圖書館學習。' }], level: 'A2', tags: ['place', 'education'] },
  { word: 'museum', pronunciation: '/mjuːˈziːəm/', partOfSpeech: 'noun', translation: '博物館', explanation: 'A place displaying historical or scientific objects.', examples: [{ sentence: 'We visited the history museum.', translation: '我們參觀了歷史博物館。' }], level: 'A2', tags: ['place', 'art'] },
  { word: 'church', pronunciation: '/tʃɜːrtʃ/', partOfSpeech: 'noun', translation: '教堂', explanation: 'A building where Christians worship.', examples: [{ sentence: 'The church is very old.', translation: '這座教堂非常古老。' }], level: 'A2', tags: ['place', 'religion'] },
  { word: 'temple', pronunciation: '/ˈtɛmpəl/', partOfSpeech: 'noun', translation: '廟宇', explanation: 'A building for religious worship.', examples: [{ sentence: 'We visited a beautiful temple.', translation: '我們參觀了一座美麗的廟宇。' }], level: 'A2', tags: ['place', 'religion'] },
  { word: 'hospital', pronunciation: '/ˈhɒspɪtəl/', partOfSpeech: 'noun', translation: '醫院', explanation: 'A place for treating sick people.', examples: [{ sentence: 'She was taken to hospital.', translation: '她被送去醫院。' }], level: 'A2', tags: ['place', 'health'] },
  { word: 'police station', pronunciation: '/pəˈliːs ˌsteɪʃən/', partOfSpeech: 'noun', translation: '警察局', explanation: 'An office for police officers.', examples: [{ sentence: 'Go to the police station.', translation: '去警察局。' }], level: 'A2', tags: ['place'] },
  { word: 'post office', pronunciation: '/poʊst ˈɒfɪs/', partOfSpeech: 'noun', translation: '郵局', explanation: 'A place where mail is processed.', examples: [{ sentence: 'Send the package from the post office.', translation: '從郵局寄包裹。' }], level: 'A2', tags: ['place'] },
  { word: 'stadium', pronunciation: '/ˈsteɪdiəm/', partOfSpeech: 'noun', translation: '體育場', explanation: 'A large place for sports events.', examples: [{ sentence: 'The stadium holds 50,000 people.', translation: '這個體育場可容納五萬人。' }], level: 'A2', tags: ['place', 'sport'] },
  { word: 'park', pronunciation: '/pɑːrk/', partOfSpeech: 'noun', translation: '公園', explanation: 'An open area for public recreation.', examples: [{ sentence: 'We had a picnic in the park.', translation: '我們在公園野餐。' }], level: 'A1', tags: ['place', 'nature'] },
  { word: 'supermarket', pronunciation: '/ˈsuːpərˌmɑːrkɪt/', partOfSpeech: 'noun', translation: '超市', explanation: 'A large self-service food shop.', examples: [{ sentence: 'I shop at the supermarket.', translation: '我在超市購物。' }], level: 'A2', tags: ['place', 'shopping'] },
  { word: 'cinema', pronunciation: '/ˈsɪnɪmə/', partOfSpeech: 'noun', translation: '電影院', explanation: 'A place where films are shown.', examples: [{ sentence: 'Let\'s go to the cinema.', translation: '我們去電影院吧。' }], level: 'A2', tags: ['place', 'entertainment'] },
  { word: 'theatre', pronunciation: '/ˈθɪətər/', partOfSpeech: 'noun', translation: '劇院；劇場', explanation: 'A place for plays or performances.', examples: [{ sentence: 'We saw a play at the theatre.', translation: '我們在劇院看了一齣戲。' }], level: 'A2', tags: ['place', 'art', 'entertainment'] },
  { word: 'cafe', pronunciation: '/ˈkæfeɪ/', partOfSpeech: 'noun', translation: '咖啡廳', explanation: 'A small place serving drinks and snacks.', examples: [{ sentence: 'Let\'s meet at the cafe.', translation: '我們在咖啡廳見面吧。' }], level: 'A2', tags: ['place', 'food'] },
  { word: 'stadium', pronunciation: '/ˈsteɪdiəm/', partOfSpeech: 'noun', translation: '體育場', explanation: 'A large building for sports events.', examples: [{ sentence: 'The concert was held in the stadium.', translation: '演唱會在體育場舉行。' }], level: 'A2', tags: ['place', 'sport'] },
  { word: 'harbour', pronunciation: '/ˈhɑːrbər/', partOfSpeech: 'noun', translation: '港口', explanation: 'A sheltered place for ships.', examples: [{ sentence: 'The ships are in the harbour.', translation: '船隻在港口。' }], level: 'B1', tags: ['place', 'transport'] },
  { word: 'suburb', pronunciation: '/ˈsʌbɜːrb/', partOfSpeech: 'noun', translation: '郊區', explanation: 'A residential area outside the city centre.', examples: [{ sentence: 'They live in the suburbs.', translation: '他們住在郊區。' }], level: 'B1', tags: ['place'] },
  { word: 'countryside', pronunciation: '/ˈkʌntrisaɪd/', partOfSpeech: 'noun', translation: '鄉村；農村', explanation: 'Rural areas outside cities.', examples: [{ sentence: 'I love the peace of the countryside.', translation: '我喜歡鄉村的寧靜。' }], level: 'B1', tags: ['place', 'nature'] },

  // ===== A2 - Basic Prepositions / Directions =====
  { word: 'above', pronunciation: '/əˈbʌv/', partOfSpeech: 'preposition', translation: '在…上方', explanation: 'Higher than; over.', examples: [{ sentence: 'The sky is above us.', translation: '天空在我們上方。' }], level: 'A2', tags: ['preposition', 'direction'] },
  { word: 'below', pronunciation: '/bɪˈloʊ/', partOfSpeech: 'preposition', translation: '在…下方', explanation: 'Lower than; under.', examples: [{ sentence: 'The fish swim below the surface.', translation: '魚在水面下游動。' }], level: 'A2', tags: ['preposition', 'direction'] },
  { word: 'beside', pronunciation: '/bɪˈsaɪd/', partOfSpeech: 'preposition', translation: '在…旁邊', explanation: 'At the side of.', examples: [{ sentence: 'Sit beside me.', translation: '坐在我旁邊。' }], level: 'A2', tags: ['preposition', 'direction'] },
  { word: 'between', pronunciation: '/bɪˈtwiːn/', partOfSpeech: 'preposition', translation: '在…之間', explanation: 'In the space separating two things.', examples: [{ sentence: 'The shop is between the bank and the school.', translation: '商店在銀行和學校之間。' }], level: 'A2', tags: ['preposition', 'direction'] },
  { word: 'through', pronunciation: '/θruː/', partOfSpeech: 'preposition', translation: '通過；穿過', explanation: 'Moving from one side to the other.', examples: [{ sentence: 'Walk through the door.', translation: '穿過門走進去。' }], level: 'A2', tags: ['preposition', 'direction'] },
  { word: 'across', pronunciation: '/əˈkrɒs/', partOfSpeech: 'preposition', translation: '橫越；在…對面', explanation: 'From one side to the other.', examples: [{ sentence: 'Walk across the road.', translation: '走過馬路。' }], level: 'A2', tags: ['preposition', 'direction'] },
  { word: 'towards', pronunciation: '/tɔːrdz/', partOfSpeech: 'preposition', translation: '朝向；向…方向', explanation: 'In the direction of.', examples: [{ sentence: 'Walk towards the exit.', translation: '朝出口走。' }], level: 'A2', tags: ['preposition', 'direction'] },
  { word: 'beyond', pronunciation: '/biˈɒnd/', partOfSpeech: 'preposition', translation: '超越；在…那邊', explanation: 'On the other side of; further than.', examples: [{ sentence: 'It\'s beyond my understanding.', translation: '這超出了我的理解。' }], level: 'B1', tags: ['preposition'] },

  // ===== A2 - Time Expressions =====
  { word: 'yesterday', pronunciation: '/ˈjɛstərdeɪ/', partOfSpeech: 'adverb', translation: '昨天', explanation: 'The day before today.', examples: [{ sentence: 'I saw her yesterday.', translation: '我昨天看到她了。' }], level: 'A1', tags: ['time'] },
  { word: 'tomorrow', pronunciation: '/təˈmɒroʊ/', partOfSpeech: 'adverb', translation: '明天', explanation: 'The day after today.', examples: [{ sentence: 'I\'ll see you tomorrow.', translation: '明天見。' }], level: 'A1', tags: ['time'] },
  { word: 'tonight', pronunciation: '/təˈnaɪt/', partOfSpeech: 'adverb', translation: '今晚', explanation: 'The night of today.', examples: [{ sentence: 'What are you doing tonight?', translation: '你今晚要做什麼？' }], level: 'A1', tags: ['time'] },
  { word: 'lately', pronunciation: '/ˈleɪtli/', partOfSpeech: 'adverb', translation: '最近', explanation: 'In recent times.', examples: [{ sentence: 'Have you been busy lately?', translation: '你最近很忙嗎？' }], level: 'A2', tags: ['time'] },
  { word: 'recently', pronunciation: '/ˈriːsəntli/', partOfSpeech: 'adverb', translation: '最近；近來', explanation: 'Not long ago.', examples: [{ sentence: 'I recently moved here.', translation: '我最近搬來這裡。' }], level: 'A2', tags: ['time'] },
  { word: 'immediately', pronunciation: '/ɪˈmiːdiɪtli/', partOfSpeech: 'adverb', translation: '立即', explanation: 'At once; without delay.', examples: [{ sentence: 'Call me immediately.', translation: '立即打電話給我。' }], level: 'B1', tags: ['time'] },
  { word: 'eventually', pronunciation: '/ɪˈvɛntʃuəli/', partOfSpeech: 'adverb', translation: '最終；最後', explanation: 'After a long time.', examples: [{ sentence: 'They eventually found the answer.', translation: '他們最終找到了答案。' }], level: 'B1', tags: ['time'] },
  { word: 'suddenly', pronunciation: '/ˈsʌdənli/', partOfSpeech: 'adverb', translation: '突然地', explanation: 'Happening without warning.', examples: [{ sentence: 'The light suddenly went off.', translation: '燈突然滅了。' }], level: 'B1', tags: ['time'] },
  { word: 'frequently', pronunciation: '/ˈfriːkwəntli/', partOfSpeech: 'adverb', translation: '頻繁地', explanation: 'Often; many times.', examples: [{ sentence: 'I frequently visit the library.', translation: '我頻繁地去圖書館。' }], level: 'B1', tags: ['time'] },
  { word: 'occasionally', pronunciation: '/əˈkeɪʒənəli/', partOfSpeech: 'adverb', translation: '偶爾', explanation: 'Sometimes but not regularly.', examples: [{ sentence: 'I occasionally eat fast food.', translation: '我偶爾吃速食。' }], level: 'B1', tags: ['time'] },
  { word: 'century', pronunciation: '/ˈsɛntʃəri/', partOfSpeech: 'noun', translation: '世紀', explanation: 'A period of 100 years.', examples: [{ sentence: 'We are in the 21st century.', translation: '我們在21世紀。' }], level: 'B1', tags: ['time'] },
  { word: 'decade', pronunciation: '/ˈdɛkeɪd/', partOfSpeech: 'noun', translation: '十年', explanation: 'A period of ten years.', examples: [{ sentence: 'A lot changed in a decade.', translation: '十年內改變了很多。' }], level: 'B1', tags: ['time'] },
  { word: 'generation', pronunciation: '/ˌdʒɛnəˈreɪʃən/', partOfSpeech: 'noun', translation: '世代', explanation: 'All the people born at a similar time.', examples: [{ sentence: 'The younger generation likes technology.', translation: '年輕世代喜歡科技。' }], level: 'B1', tags: ['time', 'society'] },

  // ===== B1 - Describing Things =====
  { word: 'ancient', pronunciation: '/ˈeɪnʃənt/', partOfSpeech: 'adjective', translation: '古老的', explanation: 'Very old; from a long time ago.', examples: [{ sentence: 'Rome has ancient ruins.', translation: '羅馬有古老的遺跡。' }], level: 'B1', tags: ['adjective', 'history'] },
  { word: 'modern', pronunciation: '/ˈmɒdərn/', partOfSpeech: 'adjective', translation: '現代的', explanation: 'Relating to the present time.', examples: [{ sentence: 'I prefer modern design.', translation: '我偏好現代設計。' }], level: 'B1', tags: ['adjective'] },
  { word: 'popular', pronunciation: '/ˈpɒpjʊlər/', partOfSpeech: 'adjective', translation: '受歡迎的', explanation: 'Liked by many people.', examples: [{ sentence: 'This restaurant is very popular.', translation: '這家餐廳非常受歡迎。' }], level: 'A2', tags: ['adjective'] },
  { word: 'typical', pronunciation: '/ˈtɪpɪkəl/', partOfSpeech: 'adjective', translation: '典型的', explanation: 'Having the usual characteristics.', examples: [{ sentence: 'It\'s a typical day in Taiwan.', translation: '這是台灣典型的一天。' }], level: 'B1', tags: ['adjective'] },
  { word: 'specific', pronunciation: '/spɪˈsɪfɪk/', partOfSpeech: 'adjective', translation: '特定的', explanation: 'Particular; exact.', examples: [{ sentence: 'Can you be more specific?', translation: '你能說得更具體嗎？' }], level: 'B1', tags: ['adjective'] },
  { word: 'various', pronunciation: '/ˈvɛəriəs/', partOfSpeech: 'adjective', translation: '各種各樣的', explanation: 'Of different kinds.', examples: [{ sentence: 'There are various options.', translation: '有各種選項。' }], level: 'B1', tags: ['adjective'] },
  { word: 'previous', pronunciation: '/ˈpriːviəs/', partOfSpeech: 'adjective', translation: '之前的', explanation: 'Coming before in time.', examples: [{ sentence: 'The previous chapter was long.', translation: '前一章很長。' }], level: 'B1', tags: ['adjective', 'time'] },
  { word: 'current', pronunciation: '/ˈkʌrənt/', partOfSpeech: 'adjective', translation: '當前的', explanation: 'Happening or existing now.', examples: [{ sentence: 'What is the current situation?', translation: '目前的情況如何？' }], level: 'B1', tags: ['adjective', 'time'] },
  { word: 'recent', pronunciation: '/ˈriːsənt/', partOfSpeech: 'adjective', translation: '最近的', explanation: 'Happening not long ago.', examples: [{ sentence: 'This is a recent photo.', translation: '這是最近照的照片。' }], level: 'B1', tags: ['adjective', 'time'] },
  { word: 'necessary', pronunciation: '/ˈnɛsɪsɪri/', partOfSpeech: 'adjective', translation: '必要的', explanation: 'Required; essential.', examples: [{ sentence: 'Is it necessary to attend?', translation: '有必要出席嗎？' }], level: 'B1', tags: ['adjective'] },
  { word: 'available', pronunciation: '/əˈveɪləbəl/', partOfSpeech: 'adjective', translation: '可用的；有空的', explanation: 'Ready for use; free to meet.', examples: [{ sentence: 'Are you available tomorrow?', translation: '你明天有空嗎？' }], level: 'B1', tags: ['adjective'] },
  { word: 'successful', pronunciation: '/səkˈsɛsfʊl/', partOfSpeech: 'adjective', translation: '成功的', explanation: 'Achieving the desired result.', examples: [{ sentence: 'She is a successful businesswoman.', translation: '她是一位成功的商人。' }], level: 'B1', tags: ['adjective', 'work'] },
  { word: 'complex', pronunciation: '/ˈkɒmplɛks/', partOfSpeech: 'adjective', translation: '複雜的', explanation: 'Made of many connected parts.', examples: [{ sentence: 'This is a complex problem.', translation: '這是一個複雜的問題。' }], level: 'B2', tags: ['adjective'] },
  { word: 'efficient', pronunciation: '/ɪˈfɪʃənt/', partOfSpeech: 'adjective', translation: '有效率的', explanation: 'Producing results without wasting time.', examples: [{ sentence: 'She is a very efficient worker.', translation: '她是一個非常有效率的工作者。' }], level: 'B2', tags: ['adjective', 'work'] },
  { word: 'significant', pronunciation: '/sɪɡˈnɪfɪkənt/', partOfSpeech: 'adjective', translation: '重要的；顯著的', explanation: 'Important or notable.', examples: [{ sentence: 'There was a significant change.', translation: '有顯著的變化。' }], level: 'B2', tags: ['adjective'] },
  { word: 'enormous', pronunciation: '/ɪˈnɔːrməs/', partOfSpeech: 'adjective', translation: '巨大的', explanation: 'Very large.', examples: [{ sentence: 'The whale is enormous.', translation: '鯨魚非常巨大。' }], level: 'B1', tags: ['adjective', 'size'] },
  { word: 'tiny', pronunciation: '/ˈtaɪni/', partOfSpeech: 'adjective', translation: '極小的', explanation: 'Very small.', examples: [{ sentence: 'The ant is tiny.', translation: '螞蟻很小。' }], level: 'A2', tags: ['adjective', 'size'] },
  { word: 'precious', pronunciation: '/ˈprɛʃəs/', partOfSpeech: 'adjective', translation: '珍貴的', explanation: 'Of great value or importance.', examples: [{ sentence: 'Time is precious.', translation: '時間是珍貴的。' }], level: 'B1', tags: ['adjective'] },
  { word: 'traditional', pronunciation: '/trəˈdɪʃənəl/', partOfSpeech: 'adjective', translation: '傳統的', explanation: 'Following old customs.', examples: [{ sentence: 'We ate traditional food.', translation: '我們吃了傳統食物。' }], level: 'B1', tags: ['adjective', 'society'] },
  { word: 'formal', pronunciation: '/ˈfɔːrməl/', partOfSpeech: 'adjective', translation: '正式的', explanation: 'Official; following established rules.', examples: [{ sentence: 'This is a formal event.', translation: '這是一個正式的場合。' }], level: 'B1', tags: ['adjective', 'work'] },
  { word: 'informal', pronunciation: '/ɪnˈfɔːrməl/', partOfSpeech: 'adjective', translation: '非正式的', explanation: 'Not official; casual.', examples: [{ sentence: 'It\'s an informal meeting.', translation: '這是一次非正式的會議。' }], level: 'B1', tags: ['adjective'] },

  // ===== B1 - Animals Extended =====
  { word: 'lion', pronunciation: '/ˈlaɪən/', partOfSpeech: 'noun', translation: '獅子', explanation: 'A large wild cat.', examples: [{ sentence: 'The lion roared loudly.', translation: '獅子大聲吼叫。' }], level: 'A2', tags: ['animal'] },
  { word: 'tiger', pronunciation: '/ˈtaɪɡər/', partOfSpeech: 'noun', translation: '老虎', explanation: 'A large striped wild cat.', examples: [{ sentence: 'Tigers are endangered.', translation: '老虎瀕臨絕種。' }], level: 'A2', tags: ['animal'] },
  { word: 'elephant', pronunciation: '/ˈɛlɪfənt/', partOfSpeech: 'noun', translation: '大象', explanation: 'A very large animal with a trunk.', examples: [{ sentence: 'Elephants have excellent memories.', translation: '大象有極好的記憶力。' }], level: 'A2', tags: ['animal'] },
  { word: 'bear', pronunciation: '/bɛr/', partOfSpeech: 'noun', translation: '熊', explanation: 'A large heavy mammal.', examples: [{ sentence: 'Bears hibernate in winter.', translation: '熊在冬天冬眠。' }], level: 'A2', tags: ['animal'] },
  { word: 'wolf', pronunciation: '/wʊlf/', partOfSpeech: 'noun', translation: '狼', explanation: 'A wild animal related to dogs.', examples: [{ sentence: 'Wolves live in packs.', translation: '狼群居生活。' }], level: 'A2', tags: ['animal'] },
  { word: 'fox', pronunciation: '/fɒks/', partOfSpeech: 'noun', translation: '狐狸', explanation: 'A small wild animal with a bushy tail.', examples: [{ sentence: 'The fox is cunning.', translation: '狐狸很狡猾。' }], level: 'A2', tags: ['animal'] },
  { word: 'deer', pronunciation: '/dɪr/', partOfSpeech: 'noun', translation: '鹿', explanation: 'A graceful animal with antlers.', examples: [{ sentence: 'We saw a deer in the forest.', translation: '我們在森林看到一隻鹿。' }], level: 'A2', tags: ['animal'] },
  { word: 'whale', pronunciation: '/weɪl/', partOfSpeech: 'noun', translation: '鯨魚', explanation: 'The largest mammal in the ocean.', examples: [{ sentence: 'Whales communicate by sound.', translation: '鯨魚通過聲音溝通。' }], level: 'B1', tags: ['animal', 'nature'] },
  { word: 'dolphin', pronunciation: '/ˈdɒlfɪn/', partOfSpeech: 'noun', translation: '海豚', explanation: 'An intelligent marine mammal.', examples: [{ sentence: 'Dolphins are very smart.', translation: '海豚非常聰明。' }], level: 'B1', tags: ['animal', 'nature'] },
  { word: 'eagle', pronunciation: '/ˈiːɡəl/', partOfSpeech: 'noun', translation: '老鷹', explanation: 'A large bird of prey.', examples: [{ sentence: 'Eagles have excellent eyesight.', translation: '老鷹視力極佳。' }], level: 'B1', tags: ['animal'] },
  { word: 'parrot', pronunciation: '/ˈpærət/', partOfSpeech: 'noun', translation: '鸚鵡', explanation: 'A tropical bird that can mimic sounds.', examples: [{ sentence: 'The parrot can say hello.', translation: '鸚鵡會說你好。' }], level: 'A2', tags: ['animal'] },
  { word: 'butterfly', pronunciation: '/ˈbʌtərflaɪ/', partOfSpeech: 'noun', translation: '蝴蝶', explanation: 'An insect with colourful wings.', examples: [{ sentence: 'Butterflies visit our garden.', translation: '蝴蝶到我們的花園來。' }], level: 'A2', tags: ['animal', 'nature'] },
  { word: 'snake', pronunciation: '/sneɪk/', partOfSpeech: 'noun', translation: '蛇', explanation: 'A long reptile without legs.', examples: [{ sentence: 'Some snakes are poisonous.', translation: '有些蛇是有毒的。' }], level: 'A2', tags: ['animal'] },
  { word: 'shark', pronunciation: '/ʃɑːrk/', partOfSpeech: 'noun', translation: '鯊魚', explanation: 'A large predatory ocean fish.', examples: [{ sentence: 'Sharks are apex predators.', translation: '鯊魚是頂端掠食者。' }], level: 'B1', tags: ['animal', 'nature'] },

  // ===== B2 - Global Issues =====
  { word: 'globalization', pronunciation: '/ˌɡloʊbəlaɪˈzeɪʃən/', partOfSpeech: 'noun', translation: '全球化', explanation: 'The process of world integration.', examples: [{ sentence: 'Globalization has changed trade.', translation: '全球化改變了貿易。' }], level: 'B2', tags: ['society', 'economy'] },
  { word: 'renewable', pronunciation: '/rɪˈnjuːəbəl/', partOfSpeech: 'adjective', translation: '可再生的', explanation: 'Able to be replenished naturally.', examples: [{ sentence: 'We need more renewable energy.', translation: '我們需要更多可再生能源。' }], level: 'B2', tags: ['environment', 'science'] },
  { word: 'carbon', pronunciation: '/ˈkɑːrbən/', partOfSpeech: 'noun', translation: '碳', explanation: 'A chemical element found in all living things.', examples: [{ sentence: 'Reduce your carbon footprint.', translation: '減少你的碳足跡。' }], level: 'B2', tags: ['science', 'environment'] },
  { word: 'emission', pronunciation: '/ɪˈmɪʃən/', partOfSpeech: 'noun', translation: '排放', explanation: 'A substance released into the air.', examples: [{ sentence: 'Carbon emissions must be cut.', translation: '必須削減碳排放。' }], level: 'B2', tags: ['environment'] },
  { word: 'extinction', pronunciation: '/ɪkˈstɪŋkʃən/', partOfSpeech: 'noun', translation: '滅絕', explanation: 'The complete disappearance of a species.', examples: [{ sentence: 'Many animals face extinction.', translation: '許多動物面臨滅絕。' }], level: 'B2', tags: ['environment', 'nature'] },
  { word: 'conservation', pronunciation: '/ˌkɒnsəˈveɪʃən/', partOfSpeech: 'noun', translation: '保育；保護', explanation: 'The protection of nature.', examples: [{ sentence: 'Wildlife conservation is vital.', translation: '野生動物保育至關重要。' }], level: 'B2', tags: ['environment', 'nature'] },
  { word: 'pandemic', pronunciation: '/pænˈdɛmɪk/', partOfSpeech: 'noun', translation: '大流行病', explanation: 'A disease spreading across countries.', examples: [{ sentence: 'The pandemic changed our lives.', translation: '大流行病改變了我們的生活。' }], level: 'B2', tags: ['health', 'society'] },
  { word: 'epidemic', pronunciation: '/ˌɛpɪˈdɛmɪk/', partOfSpeech: 'noun', translation: '流行病', explanation: 'A widespread occurrence of disease.', examples: [{ sentence: 'An epidemic spread through the city.', translation: '一場流行病在城市蔓延。' }], level: 'B2', tags: ['health'] },
  { word: 'cooperation', pronunciation: '/koʊˌɒpəˈreɪʃən/', partOfSpeech: 'noun', translation: '合作', explanation: 'Working together toward a goal.', examples: [{ sentence: 'International cooperation is needed.', translation: '需要國際合作。' }], level: 'B2', tags: ['society', 'work'] },
  { word: 'conflict', pronunciation: '/ˈkɒnflɪkt/', partOfSpeech: 'noun', translation: '衝突', explanation: 'A serious disagreement or fight.', examples: [{ sentence: 'The conflict lasted for years.', translation: '衝突持續了多年。' }], level: 'B2', tags: ['society', 'politics'] },
  { word: 'treaty', pronunciation: '/ˈtriːti/', partOfSpeech: 'noun', translation: '條約', explanation: 'A formal agreement between countries.', examples: [{ sentence: 'The two countries signed a treaty.', translation: '兩國簽署了條約。' }], level: 'B2', tags: ['politics'] },
  { word: 'refugee', pronunciation: '/ˌrɛfjʊˈdʒiː/', partOfSpeech: 'noun', translation: '難民', explanation: 'A person forced to leave their country.', examples: [{ sentence: 'We should help refugees.', translation: '我們應該幫助難民。' }], level: 'B2', tags: ['society', 'politics'] },

  // ===== B2 - Finance =====
  { word: 'currency', pronunciation: '/ˈkʌrənsi/', partOfSpeech: 'noun', translation: '貨幣', explanation: 'The money system of a country.', examples: [{ sentence: 'What is the local currency?', translation: '當地貨幣是什麼？' }], level: 'B1', tags: ['money', 'economy'] },
  { word: 'inflation', pronunciation: '/ɪnˈfleɪʃən/', partOfSpeech: 'noun', translation: '通貨膨脹', explanation: 'A general rise in prices.', examples: [{ sentence: 'Inflation affects purchasing power.', translation: '通貨膨脹影響購買力。' }], level: 'B2', tags: ['economy'] },
  { word: 'tax', pronunciation: '/tæks/', partOfSpeech: 'noun', translation: '稅', explanation: 'Money paid to the government.', examples: [{ sentence: 'The tax rate is 5%.', translation: '稅率是5%。' }], level: 'B1', tags: ['economy', 'money'] },
  { word: 'loan', pronunciation: '/loʊn/', partOfSpeech: 'noun', translation: '貸款', explanation: 'Money borrowed that must be repaid.', examples: [{ sentence: 'He took out a bank loan.', translation: '他申請了銀行貸款。' }], level: 'B2', tags: ['economy', 'money'] },
  { word: 'insurance', pronunciation: '/ɪnˈʃʊərəns/', partOfSpeech: 'noun', translation: '保險', explanation: 'Protection against financial loss.', examples: [{ sentence: 'Do you have health insurance?', translation: '你有健康保險嗎？' }], level: 'B2', tags: ['economy', 'money'] },
  { word: 'export', pronunciation: '/ˈɛkspɔːrt/', partOfSpeech: 'verb', translation: '出口；輸出', explanation: 'To send goods to another country.', examples: [{ sentence: 'Taiwan exports semiconductors.', translation: '台灣出口半導體。' }], level: 'B2', tags: ['economy'] },
  { word: 'import', pronunciation: '/ˈɪmpɔːrt/', partOfSpeech: 'verb', translation: '進口；輸入', explanation: 'To bring goods from another country.', examples: [{ sentence: 'We import oil from abroad.', translation: '我們從海外進口石油。' }], level: 'B2', tags: ['economy'] },
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
