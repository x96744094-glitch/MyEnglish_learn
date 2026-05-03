// 第九批次 - 破千單字 - 執行: node seed-batch9.js
require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('./models/Vocabulary');

const MONGODB_URI = (process.env.MONGODB_URI || '').trim().replace(/ㄦ/g, '-');
if (!MONGODB_URI) { console.error('請設定 MONGODB_URI'); process.exit(1); }

const newWords = [
  // ===== A1 - Classroom Actions =====
  { word: 'repeat', pronunciation: '/rɪˈpiːt/', partOfSpeech: 'verb', translation: '重複', explanation: 'To say or do again.', examples: [{ sentence: 'Please repeat that.', translation: '請重複一次。' }], level: 'A1', tags: ['verb', 'education'] },
  { word: 'explain', pronunciation: '/ɪkˈspleɪn/', partOfSpeech: 'verb', translation: '解釋', explanation: 'To make something clear.', examples: [{ sentence: 'Can you explain this?', translation: '你能解釋這個嗎？' }], level: 'A2', tags: ['verb', 'communication'] },
  { word: 'understand', pronunciation: '/ˌʌndəˈstænd/', partOfSpeech: 'verb', translation: '理解；明白', explanation: 'To know the meaning of something.', examples: [{ sentence: 'Do you understand?', translation: '你明白嗎？' }], level: 'A1', tags: ['verb', 'education'] },
  { word: 'remember', pronunciation: '/rɪˈmɛmbər/', partOfSpeech: 'verb', translation: '記得', explanation: 'To bring something back to mind.', examples: [{ sentence: 'Remember to do your homework.', translation: '記得做作業。' }], level: 'A1', tags: ['verb'] },
  { word: 'forget', pronunciation: '/fərˈɡɛt/', partOfSpeech: 'verb', translation: '忘記', explanation: 'To fail to remember.', examples: [{ sentence: 'Don\'t forget to lock the door.', translation: '不要忘記鎖門。' }], level: 'A1', tags: ['verb'] },
  { word: 'check', pronunciation: '/tʃɛk/', partOfSpeech: 'verb', translation: '核對；查看', explanation: 'To examine for correctness.', examples: [{ sentence: 'Check your work.', translation: '核對你的作業。' }], level: 'A2', tags: ['verb'] },
  { word: 'learn', pronunciation: '/lɜːrn/', partOfSpeech: 'verb', translation: '學習', explanation: 'To gain knowledge or skill.', examples: [{ sentence: 'Learn something new every day.', translation: '每天學新東西。' }], level: 'A1', tags: ['verb', 'education'] },
  { word: 'teach', pronunciation: '/tiːtʃ/', partOfSpeech: 'verb', translation: '教', explanation: 'To help someone learn.', examples: [{ sentence: 'She teaches English.', translation: '她教英語。' }], level: 'A1', tags: ['verb', 'education'] },
  { word: 'count', pronunciation: '/kaʊnt/', partOfSpeech: 'verb', translation: '數數；計算', explanation: 'To determine the total number.', examples: [{ sentence: 'Count to ten.', translation: '數到十。' }], level: 'A1', tags: ['verb', 'math'] },
  { word: 'copy', pronunciation: '/ˈkɒpi/', partOfSpeech: 'verb', translation: '複製；抄寫', explanation: 'To make an exact version of something.', examples: [{ sentence: 'Copy the notes from the board.', translation: '把黑板上的筆記抄下來。' }], level: 'A2', tags: ['verb', 'education'] },
  { word: 'translate', pronunciation: '/trænsˈleɪt/', partOfSpeech: 'verb', translation: '翻譯', explanation: 'To convert words to another language.', examples: [{ sentence: 'Translate this sentence.', translation: '翻譯這個句子。' }], level: 'A2', tags: ['verb', 'language'] },
  { word: 'present', pronunciation: '/prɪˈzɛnt/', partOfSpeech: 'verb', translation: '呈現；演示', explanation: 'To show or introduce something.', examples: [{ sentence: 'Present your project.', translation: '演示你的專案。' }], level: 'B1', tags: ['verb', 'education'] },
  { word: 'discuss', pronunciation: '/dɪˈskʌs/', partOfSpeech: 'verb', translation: '討論', explanation: 'To talk about something with others.', examples: [{ sentence: 'Discuss the topic in groups.', translation: '分組討論這個話題。' }], level: 'B1', tags: ['verb', 'communication'] },
  { word: 'solve', pronunciation: '/sɒlv/', partOfSpeech: 'verb', translation: '解決', explanation: 'To find the answer to a problem.', examples: [{ sentence: 'Can you solve this problem?', translation: '你能解決這個問題嗎？' }], level: 'B1', tags: ['verb', 'math'] },
  { word: 'measure', pronunciation: '/ˈmɛʒər/', partOfSpeech: 'verb', translation: '測量', explanation: 'To find the size or amount.', examples: [{ sentence: 'Measure the length.', translation: '測量長度。' }], level: 'A2', tags: ['verb', 'math'] },

  // ===== B1 - Adjectives for Opinion =====
  { word: 'impressive', pronunciation: '/ɪmˈprɛsɪv/', partOfSpeech: 'adjective', translation: '令人印象深刻的', explanation: 'Causing admiration.', examples: [{ sentence: 'The view was impressive.', translation: '景色令人印象深刻。' }], level: 'B1', tags: ['adjective'] },
  { word: 'disappointing', pronunciation: '/ˌdɪsəˈpɔɪntɪŋ/', partOfSpeech: 'adjective', translation: '令人失望的', explanation: 'Failing to meet expectations.', examples: [{ sentence: 'The result was disappointing.', translation: '結果令人失望。' }], level: 'B1', tags: ['adjective', 'emotion'] },
  { word: 'surprising', pronunciation: '/sərˈpraɪzɪŋ/', partOfSpeech: 'adjective', translation: '令人驚訝的', explanation: 'Causing wonder or astonishment.', examples: [{ sentence: 'The news was surprising.', translation: '這個消息令人驚訝。' }], level: 'B1', tags: ['adjective', 'emotion'] },
  { word: 'overwhelming', pronunciation: '/ˌoʊvərˈwɛlmɪŋ/', partOfSpeech: 'adjective', translation: '壓倒性的；令人不知所措的', explanation: 'Too much to deal with; very strong.', examples: [{ sentence: 'The support was overwhelming.', translation: '支持是壓倒性的。' }], level: 'B2', tags: ['adjective'] },
  { word: 'fascinating', pronunciation: '/ˈfæsɪneɪtɪŋ/', partOfSpeech: 'adjective', translation: '迷人的；令人著迷的', explanation: 'Extremely interesting.', examples: [{ sentence: 'The documentary was fascinating.', translation: '這部紀錄片令人著迷。' }], level: 'B1', tags: ['adjective'] },
  { word: 'exhausting', pronunciation: '/ɪɡˈzɔːstɪŋ/', partOfSpeech: 'adjective', translation: '令人精疲力竭的', explanation: 'Making you very tired.', examples: [{ sentence: 'The journey was exhausting.', translation: '這段旅程令人精疲力竭。' }], level: 'B1', tags: ['adjective', 'emotion'] },
  { word: 'annoying', pronunciation: '/əˈnɔɪɪŋ/', partOfSpeech: 'adjective', translation: '令人惱怒的', explanation: 'Causing irritation.', examples: [{ sentence: 'The noise is very annoying.', translation: '這個噪音很令人惱怒。' }], level: 'B1', tags: ['adjective', 'emotion'] },
  { word: 'boring', pronunciation: '/ˈbɔːrɪŋ/', partOfSpeech: 'adjective', translation: '無聊的；令人厭煩的', explanation: 'Not interesting.', examples: [{ sentence: 'The lecture was boring.', translation: '講座很無聊。' }], level: 'A2', tags: ['adjective', 'emotion'] },
  { word: 'exciting', pronunciation: '/ɪkˈsaɪtɪŋ/', partOfSpeech: 'adjective', translation: '令人興奮的', explanation: 'Causing enthusiasm.', examples: [{ sentence: 'The game was very exciting.', translation: '這場比賽非常令人興奮。' }], level: 'A2', tags: ['adjective', 'emotion'] },
  { word: 'relaxing', pronunciation: '/rɪˈlæksɪŋ/', partOfSpeech: 'adjective', translation: '令人放鬆的', explanation: 'Making you feel less tense.', examples: [{ sentence: 'A bath is relaxing.', translation: '泡澡很令人放鬆。' }], level: 'A2', tags: ['adjective'] },
  { word: 'challenging', pronunciation: '/ˈtʃælɪndʒɪŋ/', partOfSpeech: 'adjective', translation: '具有挑戰性的', explanation: 'Requiring effort and skill.', examples: [{ sentence: 'The exam was very challenging.', translation: '考試很有挑戰性。' }], level: 'B1', tags: ['adjective', 'education'] },

  // ===== A2 - Shapes =====
  { word: 'circle', pronunciation: '/ˈsɜːrkəl/', partOfSpeech: 'noun', translation: '圓形', explanation: 'A perfectly round shape.', examples: [{ sentence: 'Draw a circle.', translation: '畫一個圓形。' }], level: 'A2', tags: ['shape', 'math'] },
  { word: 'square', pronunciation: '/skwɛr/', partOfSpeech: 'noun', translation: '正方形', explanation: 'A shape with four equal sides.', examples: [{ sentence: 'The table is square.', translation: '桌子是正方形的。' }], level: 'A2', tags: ['shape', 'math'] },
  { word: 'triangle', pronunciation: '/ˈtraɪæŋɡəl/', partOfSpeech: 'noun', translation: '三角形', explanation: 'A shape with three sides.', examples: [{ sentence: 'A triangle has three angles.', translation: '三角形有三個角。' }], level: 'A2', tags: ['shape', 'math'] },
  { word: 'rectangle', pronunciation: '/ˈrɛktæŋɡəl/', partOfSpeech: 'noun', translation: '長方形', explanation: 'A shape with four sides.', examples: [{ sentence: 'A door is a rectangle.', translation: '門是長方形的。' }], level: 'A2', tags: ['shape', 'math'] },
  { word: 'oval', pronunciation: '/ˈoʊvəl/', partOfSpeech: 'noun', translation: '橢圓形', explanation: 'A shape like a stretched circle.', examples: [{ sentence: 'The egg is oval.', translation: '雞蛋是橢圓形的。' }], level: 'A2', tags: ['shape'] },
  { word: 'sphere', pronunciation: '/sfɪr/', partOfSpeech: 'noun', translation: '球形', explanation: 'A perfectly round 3D shape.', examples: [{ sentence: 'A ball is a sphere.', translation: '球是球形的。' }], level: 'B1', tags: ['shape', 'math'] },
  { word: 'cube', pronunciation: '/kjuːb/', partOfSpeech: 'noun', translation: '立方體', explanation: 'A box with six equal square faces.', examples: [{ sentence: 'An ice cube is a cube.', translation: '冰塊是立方體的。' }], level: 'B1', tags: ['shape', 'math'] },

  // ===== A2 - Seasons =====
  { word: 'spring', pronunciation: '/sprɪŋ/', partOfSpeech: 'noun', translation: '春天', explanation: 'The season between winter and summer.', examples: [{ sentence: 'Flowers bloom in spring.', translation: '春天花朵盛開。' }], level: 'A1', tags: ['season', 'time'] },
  { word: 'summer', pronunciation: '/ˈsʌmər/', partOfSpeech: 'noun', translation: '夏天', explanation: 'The warmest season.', examples: [{ sentence: 'We swim in summer.', translation: '我們夏天游泳。' }], level: 'A1', tags: ['season', 'time'] },
  { word: 'autumn', pronunciation: '/ˈɔːtəm/', partOfSpeech: 'noun', translation: '秋天', explanation: 'The season when leaves fall.', examples: [{ sentence: 'Leaves change colour in autumn.', translation: '葉子在秋天變色。' }], level: 'A1', tags: ['season', 'time'] },
  { word: 'winter', pronunciation: '/ˈwɪntər/', partOfSpeech: 'noun', translation: '冬天', explanation: 'The coldest season.', examples: [{ sentence: 'It snows in winter.', translation: '冬天會下雪。' }], level: 'A1', tags: ['season', 'time'] },

  // ===== B1 - Connectives =====
  { word: 'however', pronunciation: '/haʊˈɛvər/', partOfSpeech: 'adverb', translation: '然而；但是', explanation: 'Used to introduce a contrasting statement.', examples: [{ sentence: 'I agree. However, there are problems.', translation: '我同意。然而，有一些問題。' }], level: 'B1', tags: ['connective', 'language'] },
  { word: 'furthermore', pronunciation: '/ˈfɜːrðərmɔːr/', partOfSpeech: 'adverb', translation: '此外；而且', explanation: 'In addition; moreover.', examples: [{ sentence: 'Furthermore, the cost is high.', translation: '此外，費用很高。' }], level: 'B2', tags: ['connective', 'language'] },
  { word: 'therefore', pronunciation: '/ˈðɛrəfɔːr/', partOfSpeech: 'adverb', translation: '因此', explanation: 'As a result.', examples: [{ sentence: 'I was tired; therefore I slept.', translation: '我很累，因此睡覺了。' }], level: 'B1', tags: ['connective', 'language'] },
  { word: 'although', pronunciation: '/ɔːlˈðoʊ/', partOfSpeech: 'conjunction', translation: '雖然；儘管', explanation: 'In spite of the fact that.', examples: [{ sentence: 'Although tired, she continued.', translation: '雖然疲倦，她繼續了。' }], level: 'B1', tags: ['connective', 'language'] },
  { word: 'whereas', pronunciation: '/wɛrˈæz/', partOfSpeech: 'conjunction', translation: '而；然而', explanation: 'In contrast to.', examples: [{ sentence: 'She is shy whereas he is bold.', translation: '她很害羞，而他很大膽。' }], level: 'B2', tags: ['connective', 'language'] },
  { word: 'consequently', pronunciation: '/ˈkɒnsɪkwəntli/', partOfSpeech: 'adverb', translation: '因此；結果', explanation: 'As a result.', examples: [{ sentence: 'Consequently, sales dropped.', translation: '因此，銷售額下降了。' }], level: 'B2', tags: ['connective', 'language'] },
  { word: 'meanwhile', pronunciation: '/ˈmiːnwaɪl/', partOfSpeech: 'adverb', translation: '與此同時', explanation: 'At the same time.', examples: [{ sentence: 'Meanwhile, the project continued.', translation: '與此同時，專案繼續進行。' }], level: 'B1', tags: ['connective', 'time'] },
  { word: 'moreover', pronunciation: '/mɔːrˈoʊvər/', partOfSpeech: 'adverb', translation: '而且；此外', explanation: 'In addition to what has been said.', examples: [{ sentence: 'Moreover, the results were positive.', translation: '而且，結果是積極的。' }], level: 'B2', tags: ['connective', 'language'] },
  { word: 'nevertheless', pronunciation: '/ˌnɛvərðəˈlɛs/', partOfSpeech: 'adverb', translation: '儘管如此；然而', explanation: 'In spite of that.', examples: [{ sentence: 'It was cold; nevertheless, we went.', translation: '天氣很冷；儘管如此，我們去了。' }], level: 'B2', tags: ['connective', 'language'] },
  { word: 'in addition', pronunciation: '/ɪn əˈdɪʃən/', partOfSpeech: 'phrase', translation: '此外；另外', explanation: 'Also; besides.', examples: [{ sentence: 'In addition, there are other options.', translation: '此外，還有其他選項。' }], level: 'B1', tags: ['connective', 'language'] },
  { word: 'on the other hand', pronunciation: '/ɒn ðə ˈʌðər hænd/', partOfSpeech: 'phrase', translation: '另一方面', explanation: 'From the contrasting point of view.', examples: [{ sentence: 'On the other hand, it could work.', translation: '另一方面，它可能行得通。' }], level: 'B1', tags: ['connective', 'language'] },

  // ===== B1 - Appearances =====
  { word: 'thin', pronunciation: '/θɪn/', partOfSpeech: 'adjective', translation: '瘦的；細的', explanation: 'Of small width; not fat.', examples: [{ sentence: 'She is very thin.', translation: '她很瘦。' }], level: 'A2', tags: ['adjective', 'appearance'] },
  { word: 'fat', pronunciation: '/fæt/', partOfSpeech: 'adjective', translation: '肥胖的', explanation: 'Having a large amount of body fat.', examples: [{ sentence: 'The cat is fat.', translation: '這隻貓很肥。' }], level: 'A2', tags: ['adjective', 'appearance'] },
  { word: 'slim', pronunciation: '/slɪm/', partOfSpeech: 'adjective', translation: '苗條的', explanation: 'Thin and fit; attractively slender.', examples: [{ sentence: 'She has a slim figure.', translation: '她身材苗條。' }], level: 'B1', tags: ['adjective', 'appearance'] },
  { word: 'muscular', pronunciation: '/ˈmʌskjʊlər/', partOfSpeech: 'adjective', translation: '肌肉發達的', explanation: 'Having well-developed muscles.', examples: [{ sentence: 'He has a muscular build.', translation: '他體格很壯。' }], level: 'B1', tags: ['adjective', 'appearance', 'health'] },
  { word: 'handsome', pronunciation: '/ˈhænsəm/', partOfSpeech: 'adjective', translation: '英俊的', explanation: 'Good-looking (usually for men).', examples: [{ sentence: 'He is very handsome.', translation: '他很英俊。' }], level: 'A2', tags: ['adjective', 'appearance'] },
  { word: 'beautiful', pronunciation: '/ˈbjuːtɪfʊl/', partOfSpeech: 'adjective', translation: '美麗的', explanation: 'Pleasing to look at.', examples: [{ sentence: 'What a beautiful view!', translation: '多美麗的景色！' }], level: 'A1', tags: ['adjective', 'appearance'] },
  { word: 'ugly', pronunciation: '/ˈʌɡli/', partOfSpeech: 'adjective', translation: '醜的', explanation: 'Unpleasant to look at.', examples: [{ sentence: 'The building is quite ugly.', translation: '這棟建築相當醜。' }], level: 'A2', tags: ['adjective', 'appearance'] },
  { word: 'elegant', pronunciation: '/ˈɛlɪɡənt/', partOfSpeech: 'adjective', translation: '優雅的', explanation: 'Graceful and stylish.', examples: [{ sentence: 'She looks elegant in that dress.', translation: '她穿那件洋裝看起來很優雅。' }], level: 'B1', tags: ['adjective', 'appearance'] },
  { word: 'stylish', pronunciation: '/ˈstaɪlɪʃ/', partOfSpeech: 'adjective', translation: '時髦的', explanation: 'Having or displaying good taste.', examples: [{ sentence: 'He is always stylish.', translation: '他總是很時髦。' }], level: 'B1', tags: ['adjective', 'appearance', 'clothing'] },

  // ===== B2 - Verbs Advanced =====
  { word: 'anticipate', pronunciation: '/ænˈtɪsɪpeɪt/', partOfSpeech: 'verb', translation: '預期；期待', explanation: 'To expect something to happen.', examples: [{ sentence: 'We anticipate good results.', translation: '我們預期有好結果。' }], level: 'B2', tags: ['verb', 'academic'] },
  { word: 'collaborate', pronunciation: '/kəˈlæbəreɪt/', partOfSpeech: 'verb', translation: '合作', explanation: 'To work jointly with others.', examples: [{ sentence: 'Let\'s collaborate on this project.', translation: '讓我們合作這個專案。' }], level: 'B2', tags: ['verb', 'work'] },
  { word: 'demonstrate', pronunciation: '/ˈdɛmənstreɪt/', partOfSpeech: 'verb', translation: '示範；展示', explanation: 'To show clearly by example.', examples: [{ sentence: 'Demonstrate how it works.', translation: '示範它是如何運作的。' }], level: 'B2', tags: ['verb', 'communication'] },
  { word: 'emphasize', pronunciation: '/ˈɛmfəsaɪz/', partOfSpeech: 'verb', translation: '強調', explanation: 'To give special importance to.', examples: [{ sentence: 'I want to emphasize this point.', translation: '我想強調這一點。' }], level: 'B2', tags: ['verb', 'communication'] },
  { word: 'facilitate', pronunciation: '/fəˈsɪlɪteɪt/', partOfSpeech: 'verb', translation: '促進；使容易', explanation: 'To make something easier.', examples: [{ sentence: 'Technology facilitates communication.', translation: '科技促進了溝通。' }], level: 'B2', tags: ['verb', 'work'] },
  { word: 'maintain', pronunciation: '/meɪnˈteɪn/', partOfSpeech: 'verb', translation: '維持；維護', explanation: 'To keep in good condition.', examples: [{ sentence: 'Maintain a healthy lifestyle.', translation: '維持健康的生活方式。' }], level: 'B2', tags: ['verb'] },
  { word: 'obtain', pronunciation: '/əbˈteɪn/', partOfSpeech: 'verb', translation: '獲得', explanation: 'To get or acquire.', examples: [{ sentence: 'How can I obtain a visa?', translation: '我如何可以取得簽證？' }], level: 'B2', tags: ['verb'] },
  { word: 'overcome', pronunciation: '/ˌoʊvərˈkʌm/', partOfSpeech: 'verb', translation: '克服', explanation: 'To deal with a problem successfully.', examples: [{ sentence: 'You can overcome this challenge.', translation: '你能克服這個挑戰。' }], level: 'B2', tags: ['verb'] },
  { word: 'reflect', pronunciation: '/rɪˈflɛkt/', partOfSpeech: 'verb', translation: '反映；反思', explanation: 'To think carefully; to show or express.', examples: [{ sentence: 'Reflect on your experience.', translation: '反思你的經歷。' }], level: 'B2', tags: ['verb', 'academic'] },
  { word: 'reveal', pronunciation: '/rɪˈviːl/', partOfSpeech: 'verb', translation: '揭示；透露', explanation: 'To make known something hidden.', examples: [{ sentence: 'The data reveals the truth.', translation: '數據揭示了真相。' }], level: 'B2', tags: ['verb', 'communication'] },
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
