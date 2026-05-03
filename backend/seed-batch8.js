// 第八批次 - 突破1000單字 - 執行: node seed-batch8.js
require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('./models/Vocabulary');

const MONGODB_URI = (process.env.MONGODB_URI || '').trim().replace(/ㄦ/g, '-');
if (!MONGODB_URI) { console.error('請設定 MONGODB_URI'); process.exit(1); }

const newWords = [
  // ===== A2 - Numbers & Math =====
  { word: 'add', pronunciation: '/æd/', partOfSpeech: 'verb', translation: '加；相加', explanation: 'To combine numbers together.', examples: [{ sentence: 'Add 5 and 3 to get 8.', translation: '5加3等於8。' }], level: 'A1', tags: ['math', 'verb'] },
  { word: 'subtract', pronunciation: '/səbˈtrækt/', partOfSpeech: 'verb', translation: '減；減去', explanation: 'To take one number from another.', examples: [{ sentence: 'Subtract 3 from 10.', translation: '10減3。' }], level: 'A2', tags: ['math', 'verb'] },
  { word: 'multiply', pronunciation: '/ˈmʌltɪplaɪ/', partOfSpeech: 'verb', translation: '乘；相乘', explanation: 'To increase a number by a given amount.', examples: [{ sentence: 'Multiply 4 by 5.', translation: '4乘以5。' }], level: 'A2', tags: ['math', 'verb'] },
  { word: 'divide', pronunciation: '/dɪˈvaɪd/', partOfSpeech: 'verb', translation: '除；除以', explanation: 'To split into equal parts.', examples: [{ sentence: 'Divide 20 by 4.', translation: '20除以4。' }], level: 'A2', tags: ['math', 'verb'] },
  { word: 'equal', pronunciation: '/ˈiːkwəl/', partOfSpeech: 'adjective', translation: '相等的；平等的', explanation: 'Being the same in quantity.', examples: [{ sentence: 'Two plus two equals four.', translation: '二加二等於四。' }], level: 'A2', tags: ['math', 'adjective'] },
  { word: 'percentage', pronunciation: '/pərˈsɛntɪdʒ/', partOfSpeech: 'noun', translation: '百分比', explanation: 'A fraction expressed as a number out of 100.', examples: [{ sentence: 'What percentage passed?', translation: '通過的百分比是多少？' }], level: 'B1', tags: ['math'] },
  { word: 'average', pronunciation: '/ˈævərɪdʒ/', partOfSpeech: 'noun', translation: '平均值', explanation: 'The result of adding values and dividing by the count.', examples: [{ sentence: 'The average score was 75.', translation: '平均分數是75分。' }], level: 'B1', tags: ['math'] },
  { word: 'calculation', pronunciation: '/ˌkælkjʊˈleɪʃən/', partOfSpeech: 'noun', translation: '計算', explanation: 'The process of working out a number.', examples: [{ sentence: 'Check your calculation.', translation: '核對你的計算。' }], level: 'B1', tags: ['math'] },
  { word: 'statistics', pronunciation: '/stəˈtɪstɪks/', partOfSpeech: 'noun', translation: '統計；統計數字', explanation: 'Numerical data or its analysis.', examples: [{ sentence: 'The statistics are alarming.', translation: '這些統計數字令人警惕。' }], level: 'B2', tags: ['math', 'academic'] },
  { word: 'geometry', pronunciation: '/dʒiˈɒmɪtri/', partOfSpeech: 'noun', translation: '幾何學', explanation: 'The branch of mathematics dealing with shapes.', examples: [{ sentence: 'We studied geometry in school.', translation: '我們在學校學習幾何學。' }], level: 'B2', tags: ['math', 'education'] },

  // ===== A2 - Music =====
  { word: 'music', pronunciation: '/ˈmjuːzɪk/', partOfSpeech: 'noun', translation: '音樂', explanation: 'Sounds arranged to form a composition.', examples: [{ sentence: 'I love listening to music.', translation: '我喜歡聽音樂。' }], level: 'A1', tags: ['art', 'entertainment'] },
  { word: 'song', pronunciation: '/sɒŋ/', partOfSpeech: 'noun', translation: '歌曲', explanation: 'A piece of music with words.', examples: [{ sentence: 'My favourite song is playing.', translation: '我最喜歡的歌在播放。' }], level: 'A1', tags: ['art', 'entertainment'] },
  { word: 'guitar', pronunciation: '/ɡɪˈtɑːr/', partOfSpeech: 'noun', translation: '吉他', explanation: 'A stringed musical instrument.', examples: [{ sentence: 'He plays guitar well.', translation: '他吉他彈得很好。' }], level: 'A2', tags: ['art', 'hobby'] },
  { word: 'piano', pronunciation: '/piˈænoʊ/', partOfSpeech: 'noun', translation: '鋼琴', explanation: 'A keyboard musical instrument.', examples: [{ sentence: 'She plays the piano beautifully.', translation: '她鋼琴彈得很美。' }], level: 'A2', tags: ['art', 'hobby'] },
  { word: 'drum', pronunciation: '/drʌm/', partOfSpeech: 'noun', translation: '鼓', explanation: 'A percussion instrument.', examples: [{ sentence: 'He plays the drums in a band.', translation: '他在樂隊打鼓。' }], level: 'A2', tags: ['art', 'hobby'] },
  { word: 'violin', pronunciation: '/ˌvaɪəˈlɪn/', partOfSpeech: 'noun', translation: '小提琴', explanation: 'A stringed instrument played with a bow.', examples: [{ sentence: 'She has played violin for ten years.', translation: '她學小提琴十年了。' }], level: 'A2', tags: ['art', 'hobby'] },
  { word: 'band', pronunciation: '/bænd/', partOfSpeech: 'noun', translation: '樂團；樂隊', explanation: 'A group of musicians playing together.', examples: [{ sentence: 'My brother is in a band.', translation: '我哥哥在一個樂隊裡。' }], level: 'A2', tags: ['art', 'entertainment'] },
  { word: 'lyrics', pronunciation: '/ˈlɪrɪks/', partOfSpeech: 'noun', translation: '歌詞', explanation: 'The words of a song.', examples: [{ sentence: 'The lyrics are very meaningful.', translation: '歌詞很有意義。' }], level: 'B1', tags: ['art', 'language'] },
  { word: 'rhythm', pronunciation: '/ˈrɪðəm/', partOfSpeech: 'noun', translation: '節奏', explanation: 'A regular pattern of beats in music.', examples: [{ sentence: 'She has a great sense of rhythm.', translation: '她有很強的節奏感。' }], level: 'B1', tags: ['art', 'music'] },
  { word: 'melody', pronunciation: '/ˈmɛlɪdi/', partOfSpeech: 'noun', translation: '旋律', explanation: 'A sequence of musical notes.', examples: [{ sentence: 'The melody is beautiful.', translation: '這個旋律很美。' }], level: 'B1', tags: ['art', 'music'] },

  // ===== B1 - Academic Writing =====
  { word: 'argument', pronunciation: '/ˈɑːrɡjʊmənt/', partOfSpeech: 'noun', translation: '論點；爭論', explanation: 'A reason given in discussion.', examples: [{ sentence: 'Your argument is convincing.', translation: '你的論點很有說服力。' }], level: 'B1', tags: ['academic', 'communication'] },
  { word: 'evidence', pronunciation: '/ˈɛvɪdəns/', partOfSpeech: 'noun', translation: '證據', explanation: 'Facts that prove something.', examples: [{ sentence: 'Show me the evidence.', translation: '給我看證據。' }], level: 'B1', tags: ['academic', 'law'] },
  { word: 'conclusion', pronunciation: '/kənˈkluːʒən/', partOfSpeech: 'noun', translation: '結論', explanation: 'A judgment reached after reasoning.', examples: [{ sentence: 'What is your conclusion?', translation: '你的結論是什麼？' }], level: 'B1', tags: ['academic'] },
  { word: 'introduction', pronunciation: '/ˌɪntrəˈdʌkʃən/', partOfSpeech: 'noun', translation: '介紹；引言', explanation: 'An opening section explaining what follows.', examples: [{ sentence: 'Write an introduction.', translation: '寫一個介紹。' }], level: 'B1', tags: ['academic', 'communication'] },
  { word: 'structure', pronunciation: '/ˈstrʌktʃər/', partOfSpeech: 'noun', translation: '結構', explanation: 'The arrangement of parts.', examples: [{ sentence: 'Check the structure of your essay.', translation: '檢查你文章的結構。' }], level: 'B2', tags: ['academic'] },
  { word: 'paragraph', pronunciation: '/ˈpærəɡrɑːf/', partOfSpeech: 'noun', translation: '段落', explanation: 'A distinct section of writing.', examples: [{ sentence: 'Write three paragraphs.', translation: '寫三個段落。' }], level: 'B1', tags: ['academic', 'writing'] },
  { word: 'source', pronunciation: '/sɔːrs/', partOfSpeech: 'noun', translation: '來源', explanation: 'A place where information comes from.', examples: [{ sentence: 'Cite your sources.', translation: '引用你的來源。' }], level: 'B1', tags: ['academic'] },
  { word: 'reference', pronunciation: '/ˈrɛfrəns/', partOfSpeech: 'noun', translation: '參考；引用', explanation: 'A mention of something as a source.', examples: [{ sentence: 'Include all references.', translation: '包括所有參考資料。' }], level: 'B2', tags: ['academic'] },
  { word: 'summarize', pronunciation: '/ˈsʌməraɪz/', partOfSpeech: 'verb', translation: '總結；摘要', explanation: 'To give the main points briefly.', examples: [{ sentence: 'Summarize the main ideas.', translation: '總結主要概念。' }], level: 'B1', tags: ['academic', 'communication', 'verb'] },
  { word: 'argue', pronunciation: '/ˈɑːrɡjuː/', partOfSpeech: 'verb', translation: '論述；爭辯', explanation: 'To give reasons for or against.', examples: [{ sentence: 'The author argues that...', translation: '作者論述說...' }], level: 'B2', tags: ['academic', 'communication', 'verb'] },

  // ===== B1 - Household Chores =====
  { word: 'clean', pronunciation: '/kliːn/', partOfSpeech: 'verb', translation: '清潔；打掃', explanation: 'To remove dirt from something.', examples: [{ sentence: 'Clean the kitchen.', translation: '打掃廚房。' }], level: 'A2', tags: ['home', 'verb'] },
  { word: 'wash', pronunciation: '/wɒʃ/', partOfSpeech: 'verb', translation: '洗', explanation: 'To clean using water.', examples: [{ sentence: 'Wash the dishes.', translation: '洗碗。' }], level: 'A1', tags: ['home', 'verb'] },
  { word: 'iron', pronunciation: '/ˈaɪərn/', partOfSpeech: 'verb', translation: '熨衣服', explanation: 'To remove wrinkles from clothes using an iron.', examples: [{ sentence: 'Iron your shirt before work.', translation: '上班前熨好你的衬衫。' }], level: 'A2', tags: ['home', 'verb'] },
  { word: 'vacuum', pronunciation: '/ˈvækjuːm/', partOfSpeech: 'verb', translation: '用吸塵器清掃', explanation: 'To clean using a vacuum cleaner.', examples: [{ sentence: 'Vacuum the carpet.', translation: '用吸塵器清掃地毯。' }], level: 'A2', tags: ['home', 'verb'] },
  { word: 'sweep', pronunciation: '/swiːp/', partOfSpeech: 'verb', translation: '掃；打掃', explanation: 'To clean by brushing.', examples: [{ sentence: 'Sweep the floor.', translation: '掃地。' }], level: 'A2', tags: ['home', 'verb'] },
  { word: 'rubbish', pronunciation: '/ˈrʌbɪʃ/', partOfSpeech: 'noun', translation: '垃圾', explanation: 'Waste or discarded material.', examples: [{ sentence: 'Take out the rubbish.', translation: '倒垃圾。' }], level: 'A2', tags: ['home'] },
  { word: 'laundry', pronunciation: '/ˈlɔːndri/', partOfSpeech: 'noun', translation: '洗衣物；洗衣', explanation: 'Clothes that need washing.', examples: [{ sentence: 'Do the laundry.', translation: '洗衣服。' }], level: 'A2', tags: ['home'] },
  { word: 'grocery', pronunciation: '/ˈɡroʊsəri/', partOfSpeech: 'noun', translation: '雜貨；食品雜貨', explanation: 'Food and other everyday items.', examples: [{ sentence: 'I need to buy groceries.', translation: '我需要買食品雜貨。' }], level: 'A2', tags: ['home', 'shopping', 'food'] },

  // ===== B1 - Quantity / Measure =====
  { word: 'weight', pronunciation: '/weɪt/', partOfSpeech: 'noun', translation: '重量', explanation: 'How heavy something is.', examples: [{ sentence: 'What is the weight of this package?', translation: '這個包裹的重量是多少？' }], level: 'B1', tags: ['measure'] },
  { word: 'length', pronunciation: '/lɛŋθ/', partOfSpeech: 'noun', translation: '長度', explanation: 'The measurement of something from end to end.', examples: [{ sentence: 'What is the length of the road?', translation: '這條路的長度是多少？' }], level: 'B1', tags: ['measure'] },
  { word: 'width', pronunciation: '/wɪdθ/', partOfSpeech: 'noun', translation: '寬度', explanation: 'The measurement from side to side.', examples: [{ sentence: 'The width is 3 metres.', translation: '寬度是3公尺。' }], level: 'B1', tags: ['measure'] },
  { word: 'height', pronunciation: '/haɪt/', partOfSpeech: 'noun', translation: '高度', explanation: 'The measurement from bottom to top.', examples: [{ sentence: 'What is your height?', translation: '你的身高是多少？' }], level: 'A2', tags: ['measure'] },
  { word: 'depth', pronunciation: '/dɛpθ/', partOfSpeech: 'noun', translation: '深度', explanation: 'The measurement from top to bottom.', examples: [{ sentence: 'The depth of the lake is 30m.', translation: '這個湖的深度是30公尺。' }], level: 'B1', tags: ['measure'] },
  { word: 'distance', pronunciation: '/ˈdɪstəns/', partOfSpeech: 'noun', translation: '距離', explanation: 'The space between two points.', examples: [{ sentence: 'What is the distance to the city?', translation: '到城市的距離是多少？' }], level: 'A2', tags: ['measure', 'direction'] },
  { word: 'temperature', pronunciation: '/ˈtɛmprɪtʃər/', partOfSpeech: 'noun', translation: '溫度', explanation: 'A measurement of heat.', examples: [{ sentence: 'The temperature is 30 degrees.', translation: '溫度是30度。' }], level: 'A2', tags: ['measure', 'weather'] },
  { word: 'speed', pronunciation: '/spiːd/', partOfSpeech: 'noun', translation: '速度', explanation: 'How fast something moves.', examples: [{ sentence: 'The speed limit is 60 km/h.', translation: '速限是每小時60公里。' }], level: 'A2', tags: ['measure', 'transport'] },
  { word: 'volume', pronunciation: '/ˈvɒljuːm/', partOfSpeech: 'noun', translation: '音量；體積', explanation: 'The amount of space; the loudness of sound.', examples: [{ sentence: 'Turn up the volume.', translation: '調高音量。' }], level: 'B1', tags: ['measure'] },
  { word: 'capacity', pronunciation: '/kəˈpæsɪti/', partOfSpeech: 'noun', translation: '容量；能力', explanation: 'The maximum amount that can be held.', examples: [{ sentence: 'The stadium is at full capacity.', translation: '體育場已經滿座。' }], level: 'B1', tags: ['measure'] },

  // ===== B2 - History =====
  { word: 'civilization', pronunciation: '/ˌsɪvɪlaɪˈzeɪʃən/', partOfSpeech: 'noun', translation: '文明', explanation: 'An advanced stage of social development.', examples: [{ sentence: 'Ancient civilizations were fascinating.', translation: '古代文明令人著迷。' }], level: 'B2', tags: ['history', 'society'] },
  { word: 'empire', pronunciation: '/ˈɛmpaɪər/', partOfSpeech: 'noun', translation: '帝國', explanation: 'A group of countries under one ruler.', examples: [{ sentence: 'The Roman Empire was vast.', translation: '羅馬帝國幅員遼闊。' }], level: 'B2', tags: ['history', 'politics'] },
  { word: 'revolution', pronunciation: '/ˌrɛvəˈluːʃən/', partOfSpeech: 'noun', translation: '革命', explanation: 'A sudden change in government or society.', examples: [{ sentence: 'The industrial revolution changed society.', translation: '工業革命改變了社會。' }], level: 'B2', tags: ['history', 'society'] },
  { word: 'colony', pronunciation: '/ˈkɒləni/', partOfSpeech: 'noun', translation: '殖民地', explanation: 'A country controlled by another country.', examples: [{ sentence: 'The colony declared independence.', translation: '殖民地宣布獨立。' }], level: 'B2', tags: ['history', 'politics'] },
  { word: 'monument', pronunciation: '/ˈmɒnjʊmənt/', partOfSpeech: 'noun', translation: '紀念碑；遺跡', explanation: 'A structure built to honour someone.', examples: [{ sentence: 'Visit the famous monument.', translation: '參觀著名的紀念碑。' }], level: 'B1', tags: ['history', 'place'] },
  { word: 'era', pronunciation: '/ˈɪərə/', partOfSpeech: 'noun', translation: '時代；時期', explanation: 'A long period in history.', examples: [{ sentence: 'We are in a new era.', translation: '我們處於新時代。' }], level: 'B2', tags: ['history', 'time'] },
  { word: 'heritage', pronunciation: '/ˈhɛrɪtɪdʒ/', partOfSpeech: 'noun', translation: '文化遺產；遺產', explanation: 'Things of cultural value passed down.', examples: [{ sentence: 'Protect our cultural heritage.', translation: '保護我們的文化遺產。' }], level: 'B2', tags: ['history', 'society'] },
  { word: 'artefact', pronunciation: '/ˈɑːrtɪfækt/', partOfSpeech: 'noun', translation: '文物；人工製品', explanation: 'A historical man-made object.', examples: [{ sentence: 'The museum has ancient artefacts.', translation: '博物館有古代文物。' }], level: 'B2', tags: ['history', 'art'] },
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
