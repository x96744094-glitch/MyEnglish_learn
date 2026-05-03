// 第四批次 - 大量補充常用單字 - 執行: node seed-batch4.js
require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('./models/Vocabulary');

const MONGODB_URI = (process.env.MONGODB_URI || '').trim().replace(/ㄦ/g, '-');
if (!MONGODB_URI) { console.error('請設定 MONGODB_URI'); process.exit(1); }

const newWords = [
  // ===== A1 - Family Extended =====
  { word: 'grandfather', pronunciation: '/ˈɡrændfɑːðər/', partOfSpeech: 'noun', translation: '祖父；外公', explanation: 'The father of your parent.', examples: [{ sentence: 'My grandfather is 75 years old.', translation: '我祖父75歲了。' }], level: 'A1', tags: ['family'] },
  { word: 'grandmother', pronunciation: '/ˈɡrændmʌðər/', partOfSpeech: 'noun', translation: '祖母；外婆', explanation: 'The mother of your parent.', examples: [{ sentence: 'My grandmother cooks great food.', translation: '我祖母做的食物很棒。' }], level: 'A1', tags: ['family'] },
  { word: 'uncle', pronunciation: '/ˈʌŋkəl/', partOfSpeech: 'noun', translation: '叔叔；舅舅', explanation: 'The brother of your parent.', examples: [{ sentence: 'My uncle lives in Canada.', translation: '我叔叔住在加拿大。' }], level: 'A1', tags: ['family'] },
  { word: 'aunt', pronunciation: '/ænt/', partOfSpeech: 'noun', translation: '阿姨；姑姑', explanation: 'The sister of your parent.', examples: [{ sentence: 'My aunt is a doctor.', translation: '我阿姨是醫生。' }], level: 'A1', tags: ['family'] },
  { word: 'cousin', pronunciation: '/ˈkʌzən/', partOfSpeech: 'noun', translation: '堂兄弟；表兄弟', explanation: 'The child of your aunt or uncle.', examples: [{ sentence: 'My cousins visit during holidays.', translation: '我表兄弟在假期來訪。' }], level: 'A1', tags: ['family'] },
  { word: 'nephew', pronunciation: '/ˈnɛfjuː/', partOfSpeech: 'noun', translation: '侄子；外甥', explanation: 'The son of your sibling.', examples: [{ sentence: 'I have a cute nephew.', translation: '我有一個可愛的侄子。' }], level: 'A2', tags: ['family'] },
  { word: 'niece', pronunciation: '/niːs/', partOfSpeech: 'noun', translation: '侄女；外甥女', explanation: 'The daughter of your sibling.', examples: [{ sentence: 'My niece is very smart.', translation: '我侄女非常聰明。' }], level: 'A2', tags: ['family'] },
  { word: 'husband', pronunciation: '/ˈhʌzbənd/', partOfSpeech: 'noun', translation: '丈夫', explanation: 'A married man.', examples: [{ sentence: 'Her husband is very kind.', translation: '她丈夫非常善良。' }], level: 'A1', tags: ['family'] },
  { word: 'wife', pronunciation: '/waɪf/', partOfSpeech: 'noun', translation: '妻子', explanation: 'A married woman.', examples: [{ sentence: 'His wife is a teacher.', translation: '他妻子是老師。' }], level: 'A1', tags: ['family'] },
  { word: 'son', pronunciation: '/sʌn/', partOfSpeech: 'noun', translation: '兒子', explanation: 'A male child.', examples: [{ sentence: 'Their son is five years old.', translation: '他們的兒子五歲了。' }], level: 'A1', tags: ['family'] },
  { word: 'daughter', pronunciation: '/ˈdɔːtər/', partOfSpeech: 'noun', translation: '女兒', explanation: 'A female child.', examples: [{ sentence: 'They have two daughters.', translation: '他們有兩個女兒。' }], level: 'A1', tags: ['family'] },
  { word: 'twin', pronunciation: '/twɪn/', partOfSpeech: 'noun', translation: '雙胞胎', explanation: 'One of two children born at the same time.', examples: [{ sentence: 'She has twin brothers.', translation: '她有雙胞胎兄弟。' }], level: 'A2', tags: ['family'] },

  // ===== A2 - Clothing =====
  { word: 'shirt', pronunciation: '/ʃɜːrt/', partOfSpeech: 'noun', translation: '襯衫', explanation: 'A garment for the upper body with buttons.', examples: [{ sentence: 'He wears a white shirt.', translation: '他穿著白色襯衫。' }], level: 'A2', tags: ['clothing'] },
  { word: 'trousers', pronunciation: '/ˈtraʊzərz/', partOfSpeech: 'noun', translation: '褲子', explanation: 'A garment for the lower body.', examples: [{ sentence: 'These trousers are too tight.', translation: '這條褲子太緊了。' }], level: 'A2', tags: ['clothing'] },
  { word: 'dress', pronunciation: '/drɛs/', partOfSpeech: 'noun', translation: '洋裝', explanation: 'A one-piece garment for women.', examples: [{ sentence: 'She wore a beautiful dress.', translation: '她穿著一件漂亮的洋裝。' }], level: 'A2', tags: ['clothing'] },
  { word: 'skirt', pronunciation: '/skɜːrt/', partOfSpeech: 'noun', translation: '裙子', explanation: 'A garment hanging from the waist.', examples: [{ sentence: 'She bought a new skirt.', translation: '她買了一條新裙子。' }], level: 'A2', tags: ['clothing'] },
  { word: 'jacket', pronunciation: '/ˈdʒækɪt/', partOfSpeech: 'noun', translation: '夾克', explanation: 'A short outer garment.', examples: [{ sentence: 'Bring a jacket — it\'s cold.', translation: '帶件夾克，天氣很冷。' }], level: 'A2', tags: ['clothing'] },
  { word: 'coat', pronunciation: '/koʊt/', partOfSpeech: 'noun', translation: '大衣', explanation: 'A long warm outer garment.', examples: [{ sentence: 'I need a warm coat.', translation: '我需要一件保暖大衣。' }], level: 'A2', tags: ['clothing'] },
  { word: 'shoes', pronunciation: '/ʃuːz/', partOfSpeech: 'noun', translation: '鞋子', explanation: 'Coverings for the feet.', examples: [{ sentence: 'These shoes are comfortable.', translation: '這雙鞋很舒服。' }], level: 'A1', tags: ['clothing'] },
  { word: 'boots', pronunciation: '/buːts/', partOfSpeech: 'noun', translation: '靴子', explanation: 'Footwear that covers the ankle.', examples: [{ sentence: 'She wears boots in winter.', translation: '她冬天穿靴子。' }], level: 'A2', tags: ['clothing'] },
  { word: 'socks', pronunciation: '/sɒks/', partOfSpeech: 'noun', translation: '襪子', explanation: 'Coverings worn on the feet inside shoes.', examples: [{ sentence: 'I need clean socks.', translation: '我需要乾淨的襪子。' }], level: 'A1', tags: ['clothing'] },
  { word: 'hat', pronunciation: '/hæt/', partOfSpeech: 'noun', translation: '帽子', explanation: 'A covering for the head.', examples: [{ sentence: 'Wear a hat in the sun.', translation: '在太陽下戴帽子。' }], level: 'A1', tags: ['clothing'] },
  { word: 'gloves', pronunciation: '/ɡlʌvz/', partOfSpeech: 'noun', translation: '手套', explanation: 'Coverings for the hands.', examples: [{ sentence: 'I forgot my gloves.', translation: '我忘了帶手套。' }], level: 'A2', tags: ['clothing'] },
  { word: 'scarf', pronunciation: '/skɑːrf/', partOfSpeech: 'noun', translation: '圍巾', explanation: 'A piece of fabric worn around the neck.', examples: [{ sentence: 'She has a colourful scarf.', translation: '她有一條彩色圍巾。' }], level: 'A2', tags: ['clothing'] },
  { word: 'uniform', pronunciation: '/ˈjuːnɪfɔːrm/', partOfSpeech: 'noun', translation: '制服', explanation: 'A set of clothes worn by members of a group.', examples: [{ sentence: 'Students wear a school uniform.', translation: '學生穿校服。' }], level: 'A2', tags: ['clothing', 'education'] },
  { word: 'pyjamas', pronunciation: '/pəˈdʒɑːməz/', partOfSpeech: 'noun', translation: '睡衣', explanation: 'Loose clothing worn to bed.', examples: [{ sentence: 'I put on my pyjamas.', translation: '我穿上睡衣。' }], level: 'A2', tags: ['clothing'] },

  // ===== A2 - Hobbies =====
  { word: 'hobby', pronunciation: '/ˈhɒbi/', partOfSpeech: 'noun', translation: '嗜好；興趣', explanation: 'An activity done for pleasure.', examples: [{ sentence: 'My hobby is photography.', translation: '我的嗜好是攝影。' }], level: 'A2', tags: ['hobby'] },
  { word: 'photography', pronunciation: '/fəˈtɒɡrəfi/', partOfSpeech: 'noun', translation: '攝影', explanation: 'The art of taking photographs.', examples: [{ sentence: 'Photography is my passion.', translation: '攝影是我的熱情。' }], level: 'A2', tags: ['hobby', 'art'] },
  { word: 'painting', pronunciation: '/ˈpeɪntɪŋ/', partOfSpeech: 'noun', translation: '繪畫；油畫', explanation: 'The art of applying paint to a surface.', examples: [{ sentence: 'I enjoy painting landscapes.', translation: '我喜歡畫風景。' }], level: 'A2', tags: ['hobby', 'art'] },
  { word: 'cooking', pronunciation: '/ˈkʊkɪŋ/', partOfSpeech: 'noun', translation: '烹飪', explanation: 'The practice of preparing food.', examples: [{ sentence: 'Cooking is a useful skill.', translation: '烹飪是一項有用的技能。' }], level: 'A2', tags: ['hobby', 'food'] },
  { word: 'gardening', pronunciation: '/ˈɡɑːrdənɪŋ/', partOfSpeech: 'noun', translation: '園藝', explanation: 'The practice of growing plants.', examples: [{ sentence: 'Gardening is very relaxing.', translation: '園藝非常放鬆。' }], level: 'A2', tags: ['hobby', 'nature'] },
  { word: 'fishing', pronunciation: '/ˈfɪʃɪŋ/', partOfSpeech: 'noun', translation: '釣魚', explanation: 'The activity of catching fish.', examples: [{ sentence: 'He goes fishing every weekend.', translation: '他每週末去釣魚。' }], level: 'A2', tags: ['hobby', 'nature'] },
  { word: 'camping', pronunciation: '/ˈkæmpɪŋ/', partOfSpeech: 'noun', translation: '露營', explanation: 'Spending nights outdoors in tents.', examples: [{ sentence: 'We go camping in the mountains.', translation: '我們在山裡露營。' }], level: 'A2', tags: ['hobby', 'nature'] },
  { word: 'chess', pronunciation: '/tʃɛs/', partOfSpeech: 'noun', translation: '象棋；西洋棋', explanation: 'A board game for two players.', examples: [{ sentence: 'Can you play chess?', translation: '你會下棋嗎？' }], level: 'A2', tags: ['hobby', 'game'] },
  { word: 'puzzle', pronunciation: '/ˈpʌzəl/', partOfSpeech: 'noun', translation: '拼圖；謎題', explanation: 'A game that tests knowledge or skill.', examples: [{ sentence: 'I love doing jigsaw puzzles.', translation: '我喜歡拼拼圖。' }], level: 'A2', tags: ['hobby', 'game'] },
  { word: 'collection', pronunciation: '/kəˈlɛkʃən/', partOfSpeech: 'noun', translation: '收藏；收集', explanation: 'A group of things gathered together.', examples: [{ sentence: 'He has a stamp collection.', translation: '他有郵票收藏。' }], level: 'A2', tags: ['hobby'] },

  // ===== B1 - Nature / Environment =====
  { word: 'ocean', pronunciation: '/ˈoʊʃən/', partOfSpeech: 'noun', translation: '海洋', explanation: 'A vast body of salt water.', examples: [{ sentence: 'The Pacific Ocean is the largest.', translation: '太平洋是最大的海洋。' }], level: 'B1', tags: ['nature'] },
  { word: 'mountain', pronunciation: '/ˈmaʊntɪn/', partOfSpeech: 'noun', translation: '山', explanation: 'A large natural elevation of land.', examples: [{ sentence: 'Taiwan has many mountains.', translation: '台灣有很多山。' }], level: 'A2', tags: ['nature'] },
  { word: 'valley', pronunciation: '/ˈvæli/', partOfSpeech: 'noun', translation: '山谷', explanation: 'A low area of land between hills.', examples: [{ sentence: 'A river flows through the valley.', translation: '一條河流穿越山谷。' }], level: 'B1', tags: ['nature'] },
  { word: 'desert', pronunciation: '/ˈdɛzərt/', partOfSpeech: 'noun', translation: '沙漠', explanation: 'A dry area with little rainfall.', examples: [{ sentence: 'It\'s hot in the desert.', translation: '沙漠很熱。' }], level: 'B1', tags: ['nature'] },
  { word: 'island', pronunciation: '/ˈaɪlənd/', partOfSpeech: 'noun', translation: '島嶼', explanation: 'Land surrounded by water.', examples: [{ sentence: 'Taiwan is a beautiful island.', translation: '台灣是美麗的島嶼。' }], level: 'A2', tags: ['nature'] },
  { word: 'cliff', pronunciation: '/klɪf/', partOfSpeech: 'noun', translation: '懸崖', explanation: 'A high, steep rock face.', examples: [{ sentence: 'Don\'t stand near the cliff.', translation: '不要站在懸崖附近。' }], level: 'B1', tags: ['nature'] },
  { word: 'waterfall', pronunciation: '/ˈwɔːtərfɔːl/', partOfSpeech: 'noun', translation: '瀑布', explanation: 'A stream of water falling from height.', examples: [{ sentence: 'The waterfall is breathtaking.', translation: '瀑布令人嘆為觀止。' }], level: 'B1', tags: ['nature'] },
  { word: 'wildlife', pronunciation: '/ˈwaɪldlaɪf/', partOfSpeech: 'noun', translation: '野生動物', explanation: 'Animals living in their natural environment.', examples: [{ sentence: 'We saw amazing wildlife.', translation: '我們看到了令人驚嘆的野生動物。' }], level: 'B1', tags: ['nature', 'animal'] },
  { word: 'earthquake', pronunciation: '/ˈɜːrθkweɪk/', partOfSpeech: 'noun', translation: '地震', explanation: 'A sudden shaking of the ground.', examples: [{ sentence: 'Taiwan has many earthquakes.', translation: '台灣有很多地震。' }], level: 'B1', tags: ['nature', 'disaster'] },
  { word: 'flood', pronunciation: '/flʌd/', partOfSpeech: 'noun', translation: '洪水', explanation: 'An overflow of water onto normally dry land.', examples: [{ sentence: 'The flood destroyed many homes.', translation: '洪水摧毀了許多房屋。' }], level: 'B1', tags: ['nature', 'disaster'] },
  { word: 'drought', pronunciation: '/draʊt/', partOfSpeech: 'noun', translation: '乾旱', explanation: 'A long period with little or no rain.', examples: [{ sentence: 'The drought damaged crops.', translation: '乾旱損害了農作物。' }], level: 'B1', tags: ['nature', 'environment'] },
  { word: 'species', pronunciation: '/ˈspiːʃiːz/', partOfSpeech: 'noun', translation: '物種', explanation: 'A group of living things that can reproduce.', examples: [{ sentence: 'Many species are endangered.', translation: '許多物種瀕臨絕種。' }], level: 'B1', tags: ['nature', 'science'] },
  { word: 'habitat', pronunciation: '/ˈhæbɪtæt/', partOfSpeech: 'noun', translation: '棲息地', explanation: 'The natural environment of an organism.', examples: [{ sentence: 'The forest is their habitat.', translation: '森林是牠們的棲息地。' }], level: 'B1', tags: ['nature', 'science'] },

  // ===== B1 - Food & Cooking =====
  { word: 'ingredient', pronunciation: '/ɪnˈɡriːdiənt/', partOfSpeech: 'noun', translation: '食材；成分', explanation: 'A component used in a recipe.', examples: [{ sentence: 'What are the ingredients?', translation: '食材是什麼？' }], level: 'B1', tags: ['food', 'cooking'] },
  { word: 'recipe', pronunciation: '/ˈrɛsɪpi/', partOfSpeech: 'noun', translation: '食譜', explanation: 'Instructions for making a dish.', examples: [{ sentence: 'Can you share this recipe?', translation: '你能分享這個食譜嗎？' }], level: 'B1', tags: ['food', 'cooking'] },
  { word: 'diet', pronunciation: '/ˈdaɪɪt/', partOfSpeech: 'noun', translation: '飲食；節食', explanation: 'The foods usually eaten; a controlled eating plan.', examples: [{ sentence: 'She follows a healthy diet.', translation: '她遵循健康飲食。' }], level: 'B1', tags: ['food', 'health'] },
  { word: 'flavour', pronunciation: '/ˈfleɪvər/', partOfSpeech: 'noun', translation: '風味；口味', explanation: 'The taste of food or drink.', examples: [{ sentence: 'I love the flavour of garlic.', translation: '我喜歡大蒜的風味。' }], level: 'B1', tags: ['food'] },
  { word: 'spicy', pronunciation: '/ˈspaɪsi/', partOfSpeech: 'adjective', translation: '辣的', explanation: 'Having a strong, hot flavour.', examples: [{ sentence: 'This curry is too spicy.', translation: '這個咖喱太辣了。' }], level: 'B1', tags: ['food'] },
  { word: 'sour', pronunciation: '/saʊər/', partOfSpeech: 'adjective', translation: '酸的', explanation: 'Having a sharp acid taste.', examples: [{ sentence: 'Lemons are very sour.', translation: '檸檬非常酸。' }], level: 'B1', tags: ['food'] },
  { word: 'bitter', pronunciation: '/ˈbɪtər/', partOfSpeech: 'adjective', translation: '苦的', explanation: 'Having a harsh, unpleasant taste.', examples: [{ sentence: 'Coffee can be bitter.', translation: '咖啡可能很苦。' }], level: 'B1', tags: ['food'] },
  { word: 'salty', pronunciation: '/ˈsɔːlti/', partOfSpeech: 'adjective', translation: '鹹的', explanation: 'Tasting of salt.', examples: [{ sentence: 'This soup is too salty.', translation: '這個湯太鹹了。' }], level: 'B1', tags: ['food'] },
  { word: 'sweet', pronunciation: '/swiːt/', partOfSpeech: 'adjective', translation: '甜的', explanation: 'Having a pleasant sugar-like taste.', examples: [{ sentence: 'This cake is very sweet.', translation: '這個蛋糕很甜。' }], level: 'A1', tags: ['food'] },
  { word: 'delicious', pronunciation: '/dɪˈlɪʃəs/', partOfSpeech: 'adjective', translation: '美味的', explanation: 'Having a very pleasant taste.', examples: [{ sentence: 'This food is delicious!', translation: '這食物很美味！' }], level: 'A2', tags: ['food'] },
  { word: 'nutrition', pronunciation: '/njuːˈtrɪʃən/', partOfSpeech: 'noun', translation: '營養', explanation: 'The process of obtaining food for health.', examples: [{ sentence: 'Good nutrition is important.', translation: '良好的營養很重要。' }], level: 'B1', tags: ['food', 'health'] },
  { word: 'vegetarian', pronunciation: '/ˌvɛdʒɪˈtɛəriən/', partOfSpeech: 'adjective', translation: '素食的', explanation: 'Not eating meat.', examples: [{ sentence: 'She is vegetarian.', translation: '她是素食者。' }], level: 'B1', tags: ['food', 'health'] },

  // ===== B1 - Social Issues =====
  { word: 'poverty', pronunciation: '/ˈpɒvərti/', partOfSpeech: 'noun', translation: '貧窮', explanation: 'The state of being very poor.', examples: [{ sentence: 'Poverty is a global problem.', translation: '貧窮是全球性問題。' }], level: 'B1', tags: ['society'] },
  { word: 'inequality', pronunciation: '/ˌɪnɪˈkwɒlɪti/', partOfSpeech: 'noun', translation: '不平等', explanation: 'Difference in treatment or opportunity.', examples: [{ sentence: 'Income inequality is rising.', translation: '收入不平等在加劇。' }], level: 'B2', tags: ['society'] },
  { word: 'volunteer', pronunciation: '/ˌvɒlənˈtɪər/', partOfSpeech: 'noun', translation: '志工；義工', explanation: 'A person who works without pay.', examples: [{ sentence: 'She works as a volunteer.', translation: '她當義工。' }], level: 'B1', tags: ['society', 'work'] },
  { word: 'charity', pronunciation: '/ˈtʃærɪti/', partOfSpeech: 'noun', translation: '慈善；慈善機構', explanation: 'Giving help to those in need.', examples: [{ sentence: 'He donates to charity.', translation: '他捐款給慈善機構。' }], level: 'B1', tags: ['society'] },
  { word: 'immigration', pronunciation: '/ˌɪmɪˈɡreɪʃən/', partOfSpeech: 'noun', translation: '移民', explanation: 'The process of coming to live in another country.', examples: [{ sentence: 'Immigration has increased.', translation: '移民增加了。' }], level: 'B2', tags: ['society', 'politics'] },
  { word: 'protest', pronunciation: '/ˈproʊtɛst/', partOfSpeech: 'noun', translation: '抗議', explanation: 'A public expression of disagreement.', examples: [{ sentence: 'People held a protest.', translation: '人們舉行了抗議。' }], level: 'B2', tags: ['society', 'politics'] },
  { word: 'welfare', pronunciation: '/ˈwɛlfeər/', partOfSpeech: 'noun', translation: '福利', explanation: 'The health and happiness of people.', examples: [{ sentence: 'Child welfare is important.', translation: '兒童福利很重要。' }], level: 'B2', tags: ['society'] },
  { word: 'unemployment', pronunciation: '/ˌʌnɪmˈplɔɪmənt/', partOfSpeech: 'noun', translation: '失業', explanation: 'The state of not having a job.', examples: [{ sentence: 'Unemployment has fallen.', translation: '失業率下降了。' }], level: 'B2', tags: ['society', 'economy'] },

  // ===== B2 - Language =====
  { word: 'vocabulary', pronunciation: '/vəˈkæbjʊləri/', partOfSpeech: 'noun', translation: '詞彙', explanation: 'The words known and used.', examples: [{ sentence: 'Build your vocabulary every day.', translation: '每天擴充你的詞彙。' }], level: 'B1', tags: ['language', 'education'] },
  { word: 'grammar', pronunciation: '/ˈɡræmər/', partOfSpeech: 'noun', translation: '文法', explanation: 'The rules of a language.', examples: [{ sentence: 'English grammar can be tricky.', translation: '英文文法可能很棘手。' }], level: 'B1', tags: ['language', 'education'] },
  { word: 'pronunciation', pronunciation: '/prəˌnʌnsiˈeɪʃən/', partOfSpeech: 'noun', translation: '發音', explanation: 'The way words are spoken.', examples: [{ sentence: 'Your pronunciation is excellent.', translation: '你的發音很好。' }], level: 'B1', tags: ['language'] },
  { word: 'fluent', pronunciation: '/ˈfluːənt/', partOfSpeech: 'adjective', translation: '流利的', explanation: 'Able to speak smoothly without stopping.', examples: [{ sentence: 'She is fluent in English.', translation: '她英語很流利。' }], level: 'B1', tags: ['language'] },
  { word: 'accent', pronunciation: '/ˈæksənt/', partOfSpeech: 'noun', translation: '口音', explanation: 'The way people from a region speak.', examples: [{ sentence: 'She has a British accent.', translation: '她有英國口音。' }], level: 'B1', tags: ['language'] },
  { word: 'dialect', pronunciation: '/ˈdaɪəlɛkt/', partOfSpeech: 'noun', translation: '方言', explanation: 'A regional form of a language.', examples: [{ sentence: 'They speak a local dialect.', translation: '他們說當地方言。' }], level: 'B2', tags: ['language'] },
  { word: 'bilingual', pronunciation: '/baɪˈlɪŋɡwəl/', partOfSpeech: 'adjective', translation: '雙語的', explanation: 'Able to speak two languages.', examples: [{ sentence: 'The school is bilingual.', translation: '這所學校是雙語學校。' }], level: 'B2', tags: ['language', 'education'] },
  { word: 'translate', pronunciation: '/trænsˈleɪt/', partOfSpeech: 'verb', translation: '翻譯', explanation: 'To express words in another language.', examples: [{ sentence: 'Can you translate this sentence?', translation: '你能翻譯這個句子嗎？' }], level: 'B1', tags: ['language'] },
  { word: 'definition', pronunciation: '/ˌdɛfɪˈnɪʃən/', partOfSpeech: 'noun', translation: '定義', explanation: 'An explanation of the meaning of a word.', examples: [{ sentence: 'Look up the definition.', translation: '查一下定義。' }], level: 'B1', tags: ['language', 'education'] },
  { word: 'phrase', pronunciation: '/freɪz/', partOfSpeech: 'noun', translation: '片語；短語', explanation: 'A group of words used together.', examples: [{ sentence: 'Learn common English phrases.', translation: '學習常用英語片語。' }], level: 'B1', tags: ['language'] },
  { word: 'idiom', pronunciation: '/ˈɪdiəm/', partOfSpeech: 'noun', translation: '慣用語', explanation: 'A phrase whose meaning differs from the literal.', examples: [{ sentence: '\'Break a leg\' is an idiom.', translation: '\'Break a leg\' 是一個慣用語。' }], level: 'B2', tags: ['language'] },
  { word: 'synonym', pronunciation: '/ˈsɪnənɪm/', partOfSpeech: 'noun', translation: '同義詞', explanation: 'A word with the same meaning as another.', examples: [{ sentence: '\'Happy\' and \'glad\' are synonyms.', translation: '\'Happy\' 和 \'glad\' 是同義詞。' }], level: 'B2', tags: ['language'] },
  { word: 'antonym', pronunciation: '/ˈæntənɪm/', partOfSpeech: 'noun', translation: '反義詞', explanation: 'A word with the opposite meaning.', examples: [{ sentence: '\'Hot\' and \'cold\' are antonyms.', translation: '\'Hot\' 和 \'cold\' 是反義詞。' }], level: 'B2', tags: ['language'] },

  // ===== B2 - Psychology =====
  { word: 'psychology', pronunciation: '/saɪˈkɒlədʒi/', partOfSpeech: 'noun', translation: '心理學', explanation: 'The study of the mind and behaviour.', examples: [{ sentence: 'She studies psychology.', translation: '她學習心理學。' }], level: 'B2', tags: ['science', 'education'] },
  { word: 'motivation', pronunciation: '/ˌmoʊtɪˈveɪʃən/', partOfSpeech: 'noun', translation: '動機；積極性', explanation: 'The reason for doing something.', examples: [{ sentence: 'What is your motivation?', translation: '你的動機是什麼？' }], level: 'B2', tags: ['psychology', 'work'] },
  { word: 'behaviour', pronunciation: '/bɪˈheɪvjər/', partOfSpeech: 'noun', translation: '行為', explanation: 'The way a person acts.', examples: [{ sentence: 'His behaviour is unacceptable.', translation: '他的行為是不可接受的。' }], level: 'B2', tags: ['psychology'] },
  { word: 'attitude', pronunciation: '/ˈætɪtjuːd/', partOfSpeech: 'noun', translation: '態度', explanation: 'A way of thinking or feeling about something.', examples: [{ sentence: 'Maintain a positive attitude.', translation: '保持積極的態度。' }], level: 'B2', tags: ['psychology', 'character'] },
  { word: 'perception', pronunciation: '/pərˈsɛpʃən/', partOfSpeech: 'noun', translation: '感知；看法', explanation: 'The way something is understood.', examples: [{ sentence: 'Public perception has changed.', translation: '公眾的看法已經改變。' }], level: 'B2', tags: ['psychology'] },
  { word: 'consciousness', pronunciation: '/ˈkɒnʃəsnɪs/', partOfSpeech: 'noun', translation: '意識', explanation: 'The state of being aware.', examples: [{ sentence: 'She lost consciousness.', translation: '她失去了意識。' }], level: 'B2', tags: ['psychology', 'science'] },
  { word: 'emotion', pronunciation: '/ɪˈmoʊʃən/', partOfSpeech: 'noun', translation: '情感；情緒', explanation: 'A strong feeling such as joy or fear.', examples: [{ sentence: 'He hides his emotions.', translation: '他隱藏自己的情緒。' }], level: 'B1', tags: ['psychology', 'emotion'] },
  { word: 'stress', pronunciation: '/strɛs/', partOfSpeech: 'noun', translation: '壓力', explanation: 'A feeling of worry and tension.', examples: [{ sentence: 'Work stress affects health.', translation: '工作壓力影響健康。' }], level: 'B1', tags: ['psychology', 'health'] },
  { word: 'depression', pronunciation: '/dɪˈprɛʃən/', partOfSpeech: 'noun', translation: '憂鬱；抑鬱', explanation: 'A mental condition causing sadness.', examples: [{ sentence: 'Depression is a serious illness.', translation: '憂鬱症是一種嚴重的疾病。' }], level: 'B2', tags: ['psychology', 'health'] },

  // ===== B2 - Art & Literature =====
  { word: 'literature', pronunciation: '/ˈlɪtərɪtʃər/', partOfSpeech: 'noun', translation: '文學', explanation: 'Written works of artistic value.', examples: [{ sentence: 'I study English literature.', translation: '我學習英國文學。' }], level: 'B2', tags: ['art', 'education'] },
  { word: 'novel', pronunciation: '/ˈnɒvəl/', partOfSpeech: 'noun', translation: '小說', explanation: 'A long fictional story.', examples: [{ sentence: 'I\'m reading a historical novel.', translation: '我正在讀一本歷史小說。' }], level: 'B1', tags: ['art', 'reading'] },
  { word: 'poetry', pronunciation: '/ˈpoʊɪtri/', partOfSpeech: 'noun', translation: '詩歌', explanation: 'Literary work written in verse.', examples: [{ sentence: 'She writes beautiful poetry.', translation: '她寫了優美的詩歌。' }], level: 'B2', tags: ['art', 'language'] },
  { word: 'sculpture', pronunciation: '/ˈskʌlptʃər/', partOfSpeech: 'noun', translation: '雕塑', explanation: 'A work of art carved from stone or other material.', examples: [{ sentence: 'The sculpture is impressive.', translation: '這件雕塑很令人印象深刻。' }], level: 'B2', tags: ['art'] },
  { word: 'architecture', pronunciation: '/ˈɑːrkɪtɛktʃər/', partOfSpeech: 'noun', translation: '建築學；建築風格', explanation: 'The art and practice of designing buildings.', examples: [{ sentence: 'I love Gothic architecture.', translation: '我喜歡哥德式建築。' }], level: 'B2', tags: ['art'] },
  { word: 'musician', pronunciation: '/mjuːˈzɪʃən/', partOfSpeech: 'noun', translation: '音樂家', explanation: 'A person who plays music.', examples: [{ sentence: 'He is a talented musician.', translation: '他是一位有才華的音樂家。' }], level: 'B1', tags: ['art', 'job'] },
  { word: 'composer', pronunciation: '/kəmˈpoʊzər/', partOfSpeech: 'noun', translation: '作曲家', explanation: 'A person who writes music.', examples: [{ sentence: 'Beethoven was a great composer.', translation: '貝多芬是一位偉大的作曲家。' }], level: 'B2', tags: ['art', 'job'] },
  { word: 'gallery', pronunciation: '/ˈɡæləri/', partOfSpeech: 'noun', translation: '藝廊', explanation: 'A place where art is displayed.', examples: [{ sentence: 'We visited an art gallery.', translation: '我們參觀了一間藝廊。' }], level: 'B1', tags: ['art'] },

  // ===== B2 - Advanced Verbs =====
  { word: 'achieve', pronunciation: '/əˈtʃiːv/', partOfSpeech: 'verb', translation: '達成', explanation: 'To succeed in doing something.', examples: [{ sentence: 'You can achieve your goals.', translation: '你能達成你的目標。' }], level: 'B1', tags: ['verb'] },
  { word: 'adapt', pronunciation: '/əˈdæpt/', partOfSpeech: 'verb', translation: '適應；調整', explanation: 'To change to suit new conditions.', examples: [{ sentence: 'She adapted to the new environment.', translation: '她適應了新環境。' }], level: 'B2', tags: ['verb'] },
  { word: 'affect', pronunciation: '/əˈfɛkt/', partOfSpeech: 'verb', translation: '影響', explanation: 'To have an effect on.', examples: [{ sentence: 'Stress affects your health.', translation: '壓力影響你的健康。' }], level: 'B1', tags: ['verb'] },
  { word: 'allow', pronunciation: '/əˈlaʊ/', partOfSpeech: 'verb', translation: '允許', explanation: 'To give permission for.', examples: [{ sentence: 'Are cameras allowed here?', translation: '這裡允許拍照嗎？' }], level: 'B1', tags: ['verb'] },
  { word: 'avoid', pronunciation: '/əˈvɔɪd/', partOfSpeech: 'verb', translation: '避免', explanation: 'To keep away from.', examples: [{ sentence: 'Avoid junk food.', translation: '避免吃垃圾食品。' }], level: 'B1', tags: ['verb'] },
  { word: 'cause', pronunciation: '/kɔːz/', partOfSpeech: 'verb', translation: '導致；引起', explanation: 'To make something happen.', examples: [{ sentence: 'What caused this problem?', translation: '什麼導致了這個問題？' }], level: 'B1', tags: ['verb'] },
  { word: 'consider', pronunciation: '/kənˈsɪdər/', partOfSpeech: 'verb', translation: '考慮', explanation: 'To think carefully about.', examples: [{ sentence: 'Consider all the options.', translation: '考慮所有選項。' }], level: 'B1', tags: ['verb'] },
  { word: 'contain', pronunciation: '/kənˈteɪn/', partOfSpeech: 'verb', translation: '包含；含有', explanation: 'To have inside.', examples: [{ sentence: 'This box contains books.', translation: '這個箱子裡有書。' }], level: 'B1', tags: ['verb'] },
  { word: 'create', pronunciation: '/kriˈeɪt/', partOfSpeech: 'verb', translation: '創造', explanation: 'To bring something into existence.', examples: [{ sentence: 'She created a beautiful painting.', translation: '她創作了一幅美麗的畫。' }], level: 'B1', tags: ['verb', 'art'] },
  { word: 'decide', pronunciation: '/dɪˈsaɪd/', partOfSpeech: 'verb', translation: '決定', explanation: 'To make a choice.', examples: [{ sentence: 'I decided to study abroad.', translation: '我決定出國留學。' }], level: 'B1', tags: ['verb'] },
  { word: 'describe', pronunciation: '/dɪˈskraɪb/', partOfSpeech: 'verb', translation: '描述', explanation: 'To say what something is like.', examples: [{ sentence: 'Describe the picture.', translation: '描述這張圖片。' }], level: 'B1', tags: ['verb', 'communication'] },
  { word: 'develop', pronunciation: '/dɪˈvɛləp/', partOfSpeech: 'verb', translation: '發展；開發', explanation: 'To grow or improve.', examples: [{ sentence: 'We develop new products.', translation: '我們開發新產品。' }], level: 'B1', tags: ['verb', 'work'] },
  { word: 'encourage', pronunciation: '/ɪnˈkʌrɪdʒ/', partOfSpeech: 'verb', translation: '鼓勵', explanation: 'To give support or confidence.', examples: [{ sentence: 'Encourage your friends.', translation: '鼓勵你的朋友。' }], level: 'B1', tags: ['verb'] },
  { word: 'establish', pronunciation: '/ɪˈstæblɪʃ/', partOfSpeech: 'verb', translation: '建立；確立', explanation: 'To set up or create.', examples: [{ sentence: 'They established a new company.', translation: '他們建立了一家新公司。' }], level: 'B2', tags: ['verb', 'work'] },
  { word: 'improve', pronunciation: '/ɪmˈpruːv/', partOfSpeech: 'verb', translation: '改善；進步', explanation: 'To make or become better.', examples: [{ sentence: 'I want to improve my English.', translation: '我想改善我的英語。' }], level: 'B1', tags: ['verb'] },
  { word: 'include', pronunciation: '/ɪnˈkluːd/', partOfSpeech: 'verb', translation: '包括', explanation: 'To have as part of.', examples: [{ sentence: 'The price includes tax.', translation: '價格包括稅。' }], level: 'B1', tags: ['verb'] },
  { word: 'increase', pronunciation: '/ɪnˈkriːs/', partOfSpeech: 'verb', translation: '增加', explanation: 'To become greater in number.', examples: [{ sentence: 'Prices keep increasing.', translation: '物價持續上漲。' }], level: 'B1', tags: ['verb'] },
  { word: 'reduce', pronunciation: '/rɪˈdjuːs/', partOfSpeech: 'verb', translation: '減少', explanation: 'To make smaller.', examples: [{ sentence: 'We should reduce waste.', translation: '我們應該減少廢物。' }], level: 'B1', tags: ['verb', 'environment'] },
  { word: 'prevent', pronunciation: '/prɪˈvɛnt/', partOfSpeech: 'verb', translation: '預防；阻止', explanation: 'To stop something from happening.', examples: [{ sentence: 'Exercise helps prevent disease.', translation: '運動有助於預防疾病。' }], level: 'B1', tags: ['verb', 'health'] },
  { word: 'protect', pronunciation: '/prəˈtɛkt/', partOfSpeech: 'verb', translation: '保護', explanation: 'To keep safe from harm.', examples: [{ sentence: 'Protect the environment.', translation: '保護環境。' }], level: 'B1', tags: ['verb', 'environment'] },
  { word: 'provide', pronunciation: '/prəˈvaɪd/', partOfSpeech: 'verb', translation: '提供', explanation: 'To give what is needed.', examples: [{ sentence: 'They provide free meals.', translation: '他們提供免費餐食。' }], level: 'B1', tags: ['verb'] },
  { word: 'realize', pronunciation: '/ˈriːəlaɪz/', partOfSpeech: 'verb', translation: '意識到', explanation: 'To become aware of.', examples: [{ sentence: 'I realized my mistake.', translation: '我意識到了我的錯誤。' }], level: 'B1', tags: ['verb'] },
  { word: 'require', pronunciation: '/rɪˈkwaɪər/', partOfSpeech: 'verb', translation: '需要；要求', explanation: 'To need or demand.', examples: [{ sentence: 'This job requires experience.', translation: '這份工作需要經驗。' }], level: 'B1', tags: ['verb', 'work'] },
  { word: 'support', pronunciation: '/səˈpɔːrt/', partOfSpeech: 'verb', translation: '支持；支援', explanation: 'To give help or encouragement.', examples: [{ sentence: 'Support your local team.', translation: '支持你的本地球隊。' }], level: 'B1', tags: ['verb'] },
  { word: 'survive', pronunciation: '/sərˈvaɪv/', partOfSpeech: 'verb', translation: '生存；倖存', explanation: 'To continue to live despite danger.', examples: [{ sentence: 'How did they survive?', translation: '他們是如何生存下來的？' }], level: 'B1', tags: ['verb'] },
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
