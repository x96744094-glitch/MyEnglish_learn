// 第六批次 - 補充更多單字達到1000+ - 執行: node seed-batch6.js
require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('./models/Vocabulary');

const MONGODB_URI = (process.env.MONGODB_URI || '').trim().replace(/ㄦ/g, '-');
if (!MONGODB_URI) { console.error('請設定 MONGODB_URI'); process.exit(1); }

const newWords = [
  // ===== A1 - Colors =====
  { word: 'red', pronunciation: '/rɛd/', partOfSpeech: 'adjective', translation: '紅色的', explanation: 'Having the colour of blood.', examples: [{ sentence: 'She wore a red dress.', translation: '她穿著紅色洋裝。' }], level: 'A1', tags: ['color'] },
  { word: 'blue', pronunciation: '/bluː/', partOfSpeech: 'adjective', translation: '藍色的', explanation: 'Having the colour of the sky.', examples: [{ sentence: 'The sky is blue.', translation: '天空是藍色的。' }], level: 'A1', tags: ['color'] },
  { word: 'green', pronunciation: '/ɡriːn/', partOfSpeech: 'adjective', translation: '綠色的', explanation: 'Having the colour of leaves.', examples: [{ sentence: 'The grass is green.', translation: '草是綠色的。' }], level: 'A1', tags: ['color'] },
  { word: 'yellow', pronunciation: '/ˈjɛloʊ/', partOfSpeech: 'adjective', translation: '黃色的', explanation: 'Having the colour of the sun.', examples: [{ sentence: 'Bananas are yellow.', translation: '香蕉是黃色的。' }], level: 'A1', tags: ['color'] },
  { word: 'black', pronunciation: '/blæk/', partOfSpeech: 'adjective', translation: '黑色的', explanation: 'Having the darkest colour.', examples: [{ sentence: 'He has black hair.', translation: '他有黑色頭髮。' }], level: 'A1', tags: ['color'] },
  { word: 'white', pronunciation: '/waɪt/', partOfSpeech: 'adjective', translation: '白色的', explanation: 'Having the lightest colour.', examples: [{ sentence: 'Snow is white.', translation: '雪是白色的。' }], level: 'A1', tags: ['color'] },
  { word: 'pink', pronunciation: '/pɪŋk/', partOfSpeech: 'adjective', translation: '粉紅色的', explanation: 'A light red colour.', examples: [{ sentence: 'She likes pink flowers.', translation: '她喜歡粉紅色的花。' }], level: 'A1', tags: ['color'] },
  { word: 'purple', pronunciation: '/ˈpɜːrpəl/', partOfSpeech: 'adjective', translation: '紫色的', explanation: 'A mix of red and blue.', examples: [{ sentence: 'The grapes are purple.', translation: '葡萄是紫色的。' }], level: 'A1', tags: ['color'] },
  { word: 'orange', pronunciation: '/ˈɒrɪndʒ/', partOfSpeech: 'adjective', translation: '橙色的', explanation: 'A mix of red and yellow.', examples: [{ sentence: 'The sunset is orange.', translation: '夕陽是橙色的。' }], level: 'A1', tags: ['color'] },
  { word: 'brown', pronunciation: '/braʊn/', partOfSpeech: 'adjective', translation: '棕色的', explanation: 'The colour of earth or wood.', examples: [{ sentence: 'The bear is brown.', translation: '熊是棕色的。' }], level: 'A1', tags: ['color'] },
  { word: 'grey', pronunciation: '/ɡreɪ/', partOfSpeech: 'adjective', translation: '灰色的', explanation: 'A colour between black and white.', examples: [{ sentence: 'The sky looks grey.', translation: '天空看起來灰色的。' }], level: 'A1', tags: ['color'] },
  { word: 'dark', pronunciation: '/dɑːrk/', partOfSpeech: 'adjective', translation: '暗的；深色的', explanation: 'Without much light; deep in colour.', examples: [{ sentence: 'It\'s too dark to read.', translation: '太暗了無法閱讀。' }], level: 'A2', tags: ['color', 'adjective'] },
  { word: 'bright', pronunciation: '/braɪt/', partOfSpeech: 'adjective', translation: '明亮的', explanation: 'Giving out or reflecting much light.', examples: [{ sentence: 'The sun is bright today.', translation: '今天陽光很亮。' }], level: 'A2', tags: ['color', 'adjective'] },

  // ===== A2 - Emotions (Basic) =====
  { word: 'happy', pronunciation: '/ˈhæpi/', partOfSpeech: 'adjective', translation: '快樂的', explanation: 'Feeling pleasure or contentment.', examples: [{ sentence: 'She is very happy today.', translation: '她今天非常快樂。' }], level: 'A1', tags: ['emotion'] },
  { word: 'sad', pronunciation: '/sæd/', partOfSpeech: 'adjective', translation: '悲傷的', explanation: 'Feeling unhappy.', examples: [{ sentence: 'He looks sad.', translation: '他看起來很悲傷。' }], level: 'A1', tags: ['emotion'] },
  { word: 'angry', pronunciation: '/ˈæŋɡri/', partOfSpeech: 'adjective', translation: '生氣的', explanation: 'Feeling or showing anger.', examples: [{ sentence: 'Don\'t make me angry.', translation: '不要讓我生氣。' }], level: 'A1', tags: ['emotion'] },
  { word: 'scared', pronunciation: '/skɛrd/', partOfSpeech: 'adjective', translation: '害怕的', explanation: 'Feeling fear.', examples: [{ sentence: 'I\'m scared of spiders.', translation: '我害怕蜘蛛。' }], level: 'A2', tags: ['emotion'] },
  { word: 'surprised', pronunciation: '/sərˈpraɪzd/', partOfSpeech: 'adjective', translation: '驚訝的', explanation: 'Feeling mild astonishment.', examples: [{ sentence: 'I was surprised by the news.', translation: '我對這個消息感到驚訝。' }], level: 'A2', tags: ['emotion'] },
  { word: 'bored', pronunciation: '/bɔːrd/', partOfSpeech: 'adjective', translation: '無聊的', explanation: 'Feeling weary due to lack of interest.', examples: [{ sentence: 'The children are bored.', translation: '孩子們覺得無聊。' }], level: 'A2', tags: ['emotion'] },
  { word: 'tired', pronunciation: '/ˈtaɪərd/', partOfSpeech: 'adjective', translation: '疲倦的', explanation: 'In need of sleep or rest.', examples: [{ sentence: 'I\'m very tired tonight.', translation: '我今晚非常疲倦。' }], level: 'A1', tags: ['emotion', 'health'] },
  { word: 'excited', pronunciation: '/ɪkˈsaɪtɪd/', partOfSpeech: 'adjective', translation: '興奮的', explanation: 'Very enthusiastic and eager.', examples: [{ sentence: 'She is excited about the trip.', translation: '她對這次旅行很興奮。' }], level: 'A2', tags: ['emotion'] },
  { word: 'nervous', pronunciation: '/ˈnɜːrvəs/', partOfSpeech: 'adjective', translation: '緊張的', explanation: 'Easily agitated or anxious.', examples: [{ sentence: 'I feel nervous before the exam.', translation: '考試前我感到緊張。' }], level: 'A2', tags: ['emotion'] },
  { word: 'calm', pronunciation: '/kɑːm/', partOfSpeech: 'adjective', translation: '冷靜的', explanation: 'Not excited or upset.', examples: [{ sentence: 'Stay calm in an emergency.', translation: '緊急情況下保持冷靜。' }], level: 'A2', tags: ['emotion', 'character'] },
  { word: 'worried', pronunciation: '/ˈwʌrid/', partOfSpeech: 'adjective', translation: '擔心的', explanation: 'Feeling troubled or uneasy.', examples: [{ sentence: 'Don\'t be worried.', translation: '不要擔心。' }], level: 'A2', tags: ['emotion'] },
  { word: 'confused', pronunciation: '/kənˈfjuːzd/', partOfSpeech: 'adjective', translation: '困惑的', explanation: 'Unable to think clearly.', examples: [{ sentence: 'I\'m confused by the instructions.', translation: '我對這些說明感到困惑。' }], level: 'A2', tags: ['emotion'] },
  { word: 'interested', pronunciation: '/ˈɪntrɪstɪd/', partOfSpeech: 'adjective', translation: '感興趣的', explanation: 'Wanting to know or learn.', examples: [{ sentence: 'I am interested in science.', translation: '我對科學感興趣。' }], level: 'A2', tags: ['emotion'] },

  // ===== A2 - House Furniture =====
  { word: 'table', pronunciation: '/ˈteɪbəl/', partOfSpeech: 'noun', translation: '桌子', explanation: 'A piece of furniture with a flat top.', examples: [{ sentence: 'Dinner is on the table.', translation: '晚餐在桌上。' }], level: 'A1', tags: ['furniture', 'home'] },
  { word: 'chair', pronunciation: '/tʃɛr/', partOfSpeech: 'noun', translation: '椅子', explanation: 'A piece of furniture to sit on.', examples: [{ sentence: 'Pull up a chair.', translation: '拉一把椅子過來。' }], level: 'A1', tags: ['furniture', 'home'] },
  { word: 'sofa', pronunciation: '/ˈsoʊfə/', partOfSpeech: 'noun', translation: '沙發', explanation: 'A comfortable seat for several people.', examples: [{ sentence: 'I sit on the sofa to watch TV.', translation: '我坐在沙發上看電視。' }], level: 'A1', tags: ['furniture', 'home'] },
  { word: 'bed', pronunciation: '/bɛd/', partOfSpeech: 'noun', translation: '床', explanation: 'A piece of furniture for sleeping.', examples: [{ sentence: 'Go to bed early.', translation: '早點上床睡覺。' }], level: 'A1', tags: ['furniture', 'home'] },
  { word: 'shelf', pronunciation: '/ʃɛlf/', partOfSpeech: 'noun', translation: '架子；書架', explanation: 'A flat board fixed to a wall for storage.', examples: [{ sentence: 'Put the books on the shelf.', translation: '把書放在架子上。' }], level: 'A2', tags: ['furniture', 'home'] },
  { word: 'wardrobe', pronunciation: '/ˈwɔːrdroʊb/', partOfSpeech: 'noun', translation: '衣櫥', explanation: 'A large cupboard for clothing.', examples: [{ sentence: 'My clothes are in the wardrobe.', translation: '我的衣服在衣櫥裡。' }], level: 'A2', tags: ['furniture', 'home'] },
  { word: 'mirror', pronunciation: '/ˈmɪrər/', partOfSpeech: 'noun', translation: '鏡子', explanation: 'A surface that reflects images.', examples: [{ sentence: 'Check yourself in the mirror.', translation: '在鏡子裡看看自己。' }], level: 'A2', tags: ['furniture', 'home'] },
  { word: 'lamp', pronunciation: '/læmp/', partOfSpeech: 'noun', translation: '燈；檯燈', explanation: 'A device that produces light.', examples: [{ sentence: 'Turn on the lamp.', translation: '打開燈。' }], level: 'A2', tags: ['furniture', 'home'] },
  { word: 'carpet', pronunciation: '/ˈkɑːrpɪt/', partOfSpeech: 'noun', translation: '地毯', explanation: 'A thick fabric covering for floors.', examples: [{ sentence: 'We have a red carpet.', translation: '我們有一張紅色地毯。' }], level: 'A2', tags: ['furniture', 'home'] },
  { word: 'curtain', pronunciation: '/ˈkɜːrtɪn/', partOfSpeech: 'noun', translation: '窗簾', explanation: 'A cloth hung at windows.', examples: [{ sentence: 'Close the curtains.', translation: '拉上窗簾。' }], level: 'A2', tags: ['furniture', 'home'] },
  { word: 'fridge', pronunciation: '/frɪdʒ/', partOfSpeech: 'noun', translation: '冰箱', explanation: 'An appliance for keeping food cold.', examples: [{ sentence: 'The milk is in the fridge.', translation: '牛奶在冰箱裡。' }], level: 'A2', tags: ['furniture', 'home', 'food'] },
  { word: 'oven', pronunciation: '/ˈʌvən/', partOfSpeech: 'noun', translation: '烤箱', explanation: 'An appliance for baking or roasting.', examples: [{ sentence: 'Preheat the oven to 200°C.', translation: '將烤箱預熱至200°C。' }], level: 'A2', tags: ['furniture', 'home', 'cooking'] },
  { word: 'sink', pronunciation: '/sɪŋk/', partOfSpeech: 'noun', translation: '水槽', explanation: 'A basin with taps for washing.', examples: [{ sentence: 'Wash your hands in the sink.', translation: '在水槽洗手。' }], level: 'A2', tags: ['furniture', 'home'] },

  // ===== A2 - School & Education =====
  { word: 'classroom', pronunciation: '/ˈklɑːsruːm/', partOfSpeech: 'noun', translation: '教室', explanation: 'A room where teaching takes place.', examples: [{ sentence: 'The classroom has 30 students.', translation: '教室有30名學生。' }], level: 'A1', tags: ['education', 'place'] },
  { word: 'blackboard', pronunciation: '/ˈblækbɔːrd/', partOfSpeech: 'noun', translation: '黑板', explanation: 'A dark board used for writing in class.', examples: [{ sentence: 'Write the answer on the blackboard.', translation: '在黑板上寫答案。' }], level: 'A1', tags: ['education'] },
  { word: 'notebook', pronunciation: '/ˈnoʊtbʊk/', partOfSpeech: 'noun', translation: '筆記本', explanation: 'A book for writing notes.', examples: [{ sentence: 'Take notes in your notebook.', translation: '在筆記本上記筆記。' }], level: 'A1', tags: ['education'] },
  { word: 'pencil', pronunciation: '/ˈpɛnsəl/', partOfSpeech: 'noun', translation: '鉛筆', explanation: 'A tool for writing or drawing.', examples: [{ sentence: 'Do you have a pencil?', translation: '你有鉛筆嗎？' }], level: 'A1', tags: ['education'] },
  { word: 'pen', pronunciation: '/pɛn/', partOfSpeech: 'noun', translation: '鋼筆；原子筆', explanation: 'A device filled with ink for writing.', examples: [{ sentence: 'Sign here with a pen.', translation: '用筆在這裡簽名。' }], level: 'A1', tags: ['education'] },
  { word: 'ruler', pronunciation: '/ˈruːlər/', partOfSpeech: 'noun', translation: '尺', explanation: 'A straight tool for measuring.', examples: [{ sentence: 'Use a ruler to draw straight lines.', translation: '用尺畫直線。' }], level: 'A1', tags: ['education'] },
  { word: 'eraser', pronunciation: '/ɪˈreɪzər/', partOfSpeech: 'noun', translation: '橡皮擦', explanation: 'A rubber tool for removing pencil marks.', examples: [{ sentence: 'Can I borrow your eraser?', translation: '我可以借你的橡皮擦嗎？' }], level: 'A1', tags: ['education'] },
  { word: 'dictionary', pronunciation: '/ˈdɪkʃənɛri/', partOfSpeech: 'noun', translation: '字典', explanation: 'A book with words and their meanings.', examples: [{ sentence: 'Look it up in the dictionary.', translation: '在字典查找它。' }], level: 'A2', tags: ['education', 'language'] },
  { word: 'textbook', pronunciation: '/ˈtɛkstbʊk/', partOfSpeech: 'noun', translation: '教科書', explanation: 'A book used for learning a subject.', examples: [{ sentence: 'We need the science textbook.', translation: '我們需要科學教科書。' }], level: 'A2', tags: ['education'] },
  { word: 'exam', pronunciation: '/ɪɡˈzæm/', partOfSpeech: 'noun', translation: '考試', explanation: 'A formal test of knowledge.', examples: [{ sentence: 'I have an exam next week.', translation: '我下週有考試。' }], level: 'A2', tags: ['education'] },
  { word: 'grade', pronunciation: '/ɡreɪd/', partOfSpeech: 'noun', translation: '成績；年級', explanation: 'A mark given for work; a level in school.', examples: [{ sentence: 'She got a good grade.', translation: '她得了好成績。' }], level: 'A2', tags: ['education'] },
  { word: 'subject', pronunciation: '/ˈsʌbdʒɪkt/', partOfSpeech: 'noun', translation: '科目', explanation: 'A topic or branch of study.', examples: [{ sentence: 'What is your favourite subject?', translation: '你最喜歡的科目是什麼？' }], level: 'A2', tags: ['education'] },
  { word: 'lesson', pronunciation: '/ˈlɛsən/', partOfSpeech: 'noun', translation: '課程；課堂', explanation: 'A period of teaching.', examples: [{ sentence: 'The English lesson starts at 9.', translation: '英語課9點開始。' }], level: 'A2', tags: ['education'] },
  { word: 'principal', pronunciation: '/ˈprɪnsɪpəl/', partOfSpeech: 'noun', translation: '校長', explanation: 'The head of a school.', examples: [{ sentence: 'The principal spoke to us.', translation: '校長跟我們說話了。' }], level: 'A2', tags: ['education', 'job'] },
  { word: 'student', pronunciation: '/ˈstjuːdənt/', partOfSpeech: 'noun', translation: '學生', explanation: 'A person who studies.', examples: [{ sentence: 'She is a good student.', translation: '她是個好學生。' }], level: 'A1', tags: ['education'] },

  // ===== B1 - Medical Vocabulary =====
  { word: 'injection', pronunciation: '/ɪnˈdʒɛkʃən/', partOfSpeech: 'noun', translation: '注射', explanation: 'A dose of medicine given with a needle.', examples: [{ sentence: 'The nurse gave me an injection.', translation: '護士給我打了一針。' }], level: 'B1', tags: ['health'] },
  { word: 'prescription', pronunciation: '/prɪˈskrɪpʃən/', partOfSpeech: 'noun', translation: '處方箋', explanation: 'A doctor\'s written order for medicine.', examples: [{ sentence: 'Take this prescription to the pharmacy.', translation: '把這張處方箋拿到藥局去。' }], level: 'B1', tags: ['health'] },
  { word: 'appointment', pronunciation: '/əˈpɔɪntmənt/', partOfSpeech: 'noun', translation: '預約；約定', explanation: 'An arrangement to meet at a set time.', examples: [{ sentence: 'I have a doctor\'s appointment.', translation: '我預約了看醫生。' }], level: 'B1', tags: ['health', 'work'] },
  { word: 'emergency', pronunciation: '/ɪˈmɜːrdʒənsi/', partOfSpeech: 'noun', translation: '緊急情況', explanation: 'A sudden dangerous situation.', examples: [{ sentence: 'Call an ambulance in an emergency.', translation: '緊急情況下叫救護車。' }], level: 'B1', tags: ['health'] },
  { word: 'ambulance', pronunciation: '/ˈæmbjʊləns/', partOfSpeech: 'noun', translation: '救護車', explanation: 'A vehicle for transporting sick people.', examples: [{ sentence: 'Call an ambulance!', translation: '叫救護車！' }], level: 'B1', tags: ['health', 'transport'] },
  { word: 'operation', pronunciation: '/ˌɒpəˈreɪʃən/', partOfSpeech: 'noun', translation: '手術；操作', explanation: 'A medical procedure on the body.', examples: [{ sentence: 'The operation was a success.', translation: '手術成功了。' }], level: 'B1', tags: ['health'] },
  { word: 'patient', pronunciation: '/ˈpeɪʃənt/', partOfSpeech: 'noun', translation: '病人', explanation: 'A person receiving medical treatment.', examples: [{ sentence: 'The patient is recovering.', translation: '病人正在恢復中。' }], level: 'B1', tags: ['health'] },
  { word: 'blood', pronunciation: '/blʌd/', partOfSpeech: 'noun', translation: '血液', explanation: 'The red liquid that flows in the body.', examples: [{ sentence: 'She donated blood.', translation: '她捐了血。' }], level: 'B1', tags: ['health', 'body'] },
  { word: 'bone', pronunciation: '/boʊn/', partOfSpeech: 'noun', translation: '骨頭', explanation: 'Hard tissue that forms the skeleton.', examples: [{ sentence: 'He broke a bone in his arm.', translation: '他手臂骨折了。' }], level: 'B1', tags: ['health', 'body'] },
  { word: 'muscle', pronunciation: '/ˈmʌsəl/', partOfSpeech: 'noun', translation: '肌肉', explanation: 'Tissue that moves the body.', examples: [{ sentence: 'Exercise builds muscles.', translation: '運動能增強肌肉。' }], level: 'B1', tags: ['health', 'body'] },
  { word: 'pregnant', pronunciation: '/ˈprɛɡnənt/', partOfSpeech: 'adjective', translation: '懷孕的', explanation: 'Having a baby growing inside.', examples: [{ sentence: 'She is three months pregnant.', translation: '她懷孕三個月了。' }], level: 'B1', tags: ['health'] },

  // ===== B1 - Learning & Study =====
  { word: 'concentrate', pronunciation: '/ˈkɒnsəntreɪt/', partOfSpeech: 'verb', translation: '集中注意力', explanation: 'To focus all attention on.', examples: [{ sentence: 'I can\'t concentrate with noise.', translation: '有噪音時我無法集中注意力。' }], level: 'B1', tags: ['education', 'verb'] },
  { word: 'memorize', pronunciation: '/ˈmɛməraɪz/', partOfSpeech: 'verb', translation: '記憶；背誦', explanation: 'To learn something by heart.', examples: [{ sentence: 'Memorize these vocabulary words.', translation: '背誦這些詞彙單字。' }], level: 'B1', tags: ['education', 'verb'] },
  { word: 'review', pronunciation: '/rɪˈvjuː/', partOfSpeech: 'verb', translation: '複習；回顧', explanation: 'To look at again; to study again.', examples: [{ sentence: 'Review your notes before the exam.', translation: '考試前複習你的筆記。' }], level: 'B1', tags: ['education', 'verb'] },
  { word: 'practice', pronunciation: '/ˈpræktɪs/', partOfSpeech: 'verb', translation: '練習', explanation: 'To do repeatedly to improve.', examples: [{ sentence: 'Practice makes perfect.', translation: '熟能生巧。' }], level: 'A2', tags: ['education', 'verb'] },
  { word: 'progress', pronunciation: '/ˈprɒɡrɛs/', partOfSpeech: 'noun', translation: '進步；進展', explanation: 'Forward movement toward a goal.', examples: [{ sentence: 'My English is making progress.', translation: '我的英語正在進步。' }], level: 'B1', tags: ['education'] },
  { word: 'mistake', pronunciation: '/mɪˈsteɪk/', partOfSpeech: 'noun', translation: '錯誤', explanation: 'Something done incorrectly.', examples: [{ sentence: 'Don\'t be afraid of making mistakes.', translation: '不要害怕犯錯。' }], level: 'A2', tags: ['education'] },
  { word: 'knowledge', pronunciation: '/ˈnɒlɪdʒ/', partOfSpeech: 'noun', translation: '知識', explanation: 'Facts and information acquired.', examples: [{ sentence: 'Knowledge is power.', translation: '知識就是力量。' }], level: 'B1', tags: ['education'] },
  { word: 'skill', pronunciation: '/skɪl/', partOfSpeech: 'noun', translation: '技能', explanation: 'An ability learned through practice.', examples: [{ sentence: 'Coding is a valuable skill.', translation: '程式設計是一種有價值的技能。' }], level: 'B1', tags: ['education', 'work'] },
  { word: 'intelligence', pronunciation: '/ɪnˈtɛlɪdʒəns/', partOfSpeech: 'noun', translation: '智力；智慧', explanation: 'The ability to learn and understand.', examples: [{ sentence: 'Emotional intelligence is important.', translation: '情緒智力很重要。' }], level: 'B2', tags: ['education', 'psychology'] },

  // ===== B2 - Advanced adjectives =====
  { word: 'ambitious', pronunciation: '/æmˈbɪʃəs/', partOfSpeech: 'adjective', translation: '有抱負的', explanation: 'Having a strong desire to succeed.', examples: [{ sentence: 'She is very ambitious.', translation: '她非常有抱負。' }], level: 'B1', tags: ['character'] },
  { word: 'remarkable', pronunciation: '/rɪˈmɑːrkəbəl/', partOfSpeech: 'adjective', translation: '非凡的', explanation: 'Worthy of attention; extraordinary.', examples: [{ sentence: 'It was a remarkable performance.', translation: '這是一場非凡的表演。' }], level: 'B2', tags: ['adjective'] },
  { word: 'outstanding', pronunciation: '/ˌaʊtˈstændɪŋ/', partOfSpeech: 'adjective', translation: '傑出的', explanation: 'Exceptionally good.', examples: [{ sentence: 'She is an outstanding student.', translation: '她是一名傑出的學生。' }], level: 'B2', tags: ['adjective'] },
  { word: 'genuine', pronunciation: '/ˈdʒɛnjuɪn/', partOfSpeech: 'adjective', translation: '真實的；真誠的', explanation: 'Truly what it is said to be; sincere.', examples: [{ sentence: 'Is this a genuine diamond?', translation: '這是真鑽石嗎？' }], level: 'B2', tags: ['adjective'] },
  { word: 'flexible', pronunciation: '/ˈflɛksɪbəl/', partOfSpeech: 'adjective', translation: '靈活的', explanation: 'Able to change easily.', examples: [{ sentence: 'We need a flexible schedule.', translation: '我們需要靈活的時間表。' }], level: 'B2', tags: ['adjective', 'work'] },
  { word: 'fragile', pronunciation: '/ˈfrædʒaɪl/', partOfSpeech: 'adjective', translation: '易碎的', explanation: 'Easily broken.', examples: [{ sentence: 'Handle this fragile item carefully.', translation: '小心處理這個易碎物品。' }], level: 'B2', tags: ['adjective'] },
  { word: 'urgent', pronunciation: '/ˈɜːrdʒənt/', partOfSpeech: 'adjective', translation: '緊急的', explanation: 'Requiring immediate attention.', examples: [{ sentence: 'This is an urgent matter.', translation: '這是緊急事務。' }], level: 'B1', tags: ['adjective'] },
  { word: 'dramatic', pronunciation: '/drəˈmætɪk/', partOfSpeech: 'adjective', translation: '戲劇性的', explanation: 'Sudden or striking.', examples: [{ sentence: 'There was a dramatic change.', translation: '有了戲劇性的變化。' }], level: 'B2', tags: ['adjective'] },
  { word: 'gradual', pronunciation: '/ˈɡrædʒuəl/', partOfSpeech: 'adjective', translation: '逐漸的', explanation: 'Taking place slowly.', examples: [{ sentence: 'There was a gradual improvement.', translation: '有了逐漸的改善。' }], level: 'B2', tags: ['adjective'] },
  { word: 'temporary', pronunciation: '/ˈtɛmpərɛri/', partOfSpeech: 'adjective', translation: '暫時的', explanation: 'Lasting for only a limited time.', examples: [{ sentence: 'This is a temporary solution.', translation: '這是暫時的解決方案。' }], level: 'B1', tags: ['adjective', 'time'] },
  { word: 'permanent', pronunciation: '/ˈpɜːrmənənt/', partOfSpeech: 'adjective', translation: '永久的', explanation: 'Lasting forever.', examples: [{ sentence: 'I want a permanent position.', translation: '我想要一個永久職位。' }], level: 'B1', tags: ['adjective', 'work'] },
  { word: 'accurate', pronunciation: '/ˈækjʊrɪt/', partOfSpeech: 'adjective', translation: '準確的', explanation: 'Correct; without errors.', examples: [{ sentence: 'The information must be accurate.', translation: '資訊必須是準確的。' }], level: 'B2', tags: ['adjective'] },
  { word: 'logical', pronunciation: '/ˈlɒdʒɪkəl/', partOfSpeech: 'adjective', translation: '合邏輯的', explanation: 'Based on clear reasoning.', examples: [{ sentence: 'That\'s a logical conclusion.', translation: '那是一個合邏輯的結論。' }], level: 'B2', tags: ['adjective', 'academic'] },
  { word: 'abstract', pronunciation: '/ˈæbstrækt/', partOfSpeech: 'adjective', translation: '抽象的', explanation: 'Existing as an idea, not a physical thing.', examples: [{ sentence: 'Love is an abstract concept.', translation: '愛是一個抽象的概念。' }], level: 'B2', tags: ['adjective', 'academic'] },
  { word: 'vulnerable', pronunciation: '/ˈvʌlnərəbəl/', partOfSpeech: 'adjective', translation: '脆弱的；易受傷的', explanation: 'Exposed to the possibility of harm.', examples: [{ sentence: 'Elderly people are vulnerable.', translation: '老年人很脆弱。' }], level: 'B2', tags: ['adjective', 'society'] },
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
