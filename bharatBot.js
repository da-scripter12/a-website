const natural = require("natural");
const LogisticRegression = require("ml-logistic-regression");


// ==============================================================================
// 1. DATASET
// ==============================================================================

const training_sentences = [

    // ---- 0: Greetings & Small Talk ----
    "hello bharat bot", "hi bharat bot", "hey bharat bot", "namaste bharat bot",
    "good morning bharat bot", "yo bharat bot", "sup bharat bot",
    "hello", "hey there", "good afternoon", "good morning",

    // ---- 1: Mahatma Gandhi ----
    "who was mahatma gandhi",
    "tell me about gandhi",
    "who is gandhiji",
    "bapu",
    "mahatma gandhi history",
    "father of the nation",
    "mohandas karamchand gandhi",
    "what did gandhi do",
    "gandhi non violence",

    // ---- 2: Subhas Chandra Bose ----
    "who was subhas chandra bose",
    "tell me about bose",
    "netaji",
    "indian national army bose",
    "subhash",
    "who founded ina",
    "give me blood and i shall give you freedom",
    "bose history",
    "chandra bose",

    // ---- 3: Bhagat Singh ----
    "who was bhagat singh",
    "tell me about bhagat singh",
    "shaheed bhagat singh",
    "bhagat singh history",
    "revolutionary bhagat singh",
    "inquilab zindabad slogan",
    "who threw bomb in central assembly",
    "who said inquilab zindabad",

    // ---- 4: Independence Day ----
    "what is independence day",
    "when is independence day",
    "august 15",
    "when did india get freedom",
    "independence date",
    "who gave india independence",
    "15th august 1947",
    "celebration of independence",
    "when was india formed",
    "when did bharat get freedom",
    "when was bharat formed",
    "who gave bharat independence",

    // ---- 5: Indian Flag ----
    "what colors are in the tiranga",
    "what is the meaning of the indian flag",
    "what is the significance of the indian flag",
    "indian flag colors",
    "ashoka chakra spokes",
    "national flag of india",
    "tell me about tiranga",
    "national flag of bharat",

    // ---- 6: Jawaharlal Nehru ----
    "who was jawaharlal nehru",
    "tell me about nehru",
    "first prime minister of india",
    "who said tryst with destiny",
    "chacha nehru",
    "pandit nehru",
    "jawaharlal history",
    "first pm of independent india",
    "first pm of independent bharat",
    "first prime minister of bharat",
    "first pm of bharat",

    // ---- 7: Bal Gangadhar Tilak ----
    "who said swaraj is my birthright and i shall have it",
    "who was bal gangadhar tilak",
    "tell me about tilak",
    "freedom fighter tilak",
    "tilak history",
    "lokmanya tilak",
    "swaraj slogan finder",

    // ---- 8: National Slogans & Motto ----
    "what is the slogan of independent india",
    "satyameva jayate",
    "national motto of india",
    "what does satyamev jayate mean",
    "jai jawan jai kisan",
    "who said jai hind",
    "famous freedom slogans",
    "what is the slogan of independent bharat",
    "national motto of bharat",

    // ---- 9: National Anthem ----
    "national anthem",
    "play the national anthem",
    "i want to listen to the national anthem",

    // ---- 10: History of India ----
    "tell me about the history of india",
    "history of india",
    "past of india",
    "history of india",
    "bharats history",
    "history of bharat",
    "tell me about the history of bharat",
    "past of bharat",

    // ---- 11: Rabindranath Tagore ----
    "who was rabindranath tagore",
    "who wrote the national anthem",
    "who is the author of gitanjali",
    "rabindranath tagore",

    // ---- 12: Rani Laxmibai ----
    "who was rani laxmibai",
    "who said mein jhansi nahi doongi",
    "who was jhansi ki rani",

    // ---- 13: Conversation ----
    "how are you",
    "whats up",
    "whats hanging",

    // ---- 14: Bot Purpose ----
    "what are you doing",
    "what is your purpose",
    "why do you exist",

    // ---- 15: Constitution ----
    "when was the constitution made",
    "who made constitution",

    // ---- 16: British ----
    "when did india come under british rule",
    "how did british conquer india",
    "through what was india conquered by british",

    // ---- 17: Spices ----
    "what are the spices are commonly used in india",
    "what spice is india well known for",

    // ---- 18: Separation ----
    "when did india pakisthan get seperated",
    "did india pakisthan get seperated",
    "when did india get seperated",

    // ---- 19: Why Britishers came/ruled ----
    "why did the britishers come to india",
    "why did the britishers come to bharat",
    "why did the britishers rule india"
];


// ==============================================================================
// 2. LABELS
// ==============================================================================

const training_labels = [

    // 0 Greetings
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    // 1 Gandhi
    1, 1, 1, 1, 1, 1, 1, 1, 1,

    // 2 Bose
    2, 2, 2, 2, 2, 2, 2, 2, 2,

    // 3 Bhagat Singh
    3, 3, 3, 3, 3, 3, 3, 3,

    // 4 Independence Day
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,

    // 5 Flag
    5, 5, 5, 5, 5, 5, 5, 5,

    // 6 Nehru
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,

    // 7 Tilak
    7, 7, 7, 7, 7, 7, 7,

    // 8 Slogans
    8, 8, 8, 8, 8, 8, 8, 8, 8,

    // 9 Anthem
    9, 9, 9,

    // 10 History
    10, 10, 10, 10, 10, 10, 10, 10,

    // 11 Tagore
    11, 11, 11, 11,

    // 12 Rani Laxmibai
    12, 12, 12,

    // 13 Conversation
    13, 13, 13,

    // 14 Purpose
    14, 14, 14,

    // 15 Constitution
    15, 15,

    // 16 British
    16, 16, 16,

    // 17 Spices
    17, 17,

    // 18 Separation
    18, 18, 18,

    // 19 Why Britishers
    19, 19, 19
];


// ==============================================================================
// 3. RESPONSES
// ==============================================================================

const responses = {

    0: [
        "Namaste! I am BharatBot. Ask me about India's freedom struggle.",
        "Hello! How can I help you learn about India's history?"
    ],

    1: [
        "Mahatma Gandhi was a leader of India's freedom movement who followed " +
        "the path of non-violence, known as Satyagraha, and played a major " +
        "role in India's independence movement."
    ],

    2: [
        "Netaji Subhas Chandra Bose was a powerful nationalist leader who " +
        "formed and led the Indian National Army, also known as the INA. " +
        "He is strongly associated with the patriotic greeting Jai Hind."
    ],

    3: [
        "Bhagat Singh was a revolutionary freedom fighter known for his " +
        "courage, sacrifice, and the famous slogan Inquilab Zindabad."
    ],

    4: [
        "India gained independence from British rule on 15 August 1947 " +
        "and celebrates Independence Day every year on this date."
    ],

    5: [
        "The Indian flag, or Tiranga, has three colors: saffron, white, " +
        "and green. The Ashoka Chakra with 24 spokes is in the center."
    ],

    6: [
        "Jawaharlal Nehru was the first Prime Minister of independent India " +
        "and delivered the famous Tryst with Destiny speech in 1947."
    ],

    7: [
        "Bal Gangadhar Tilak, known as Lokmanya, was a major nationalist " +
        "leader famous for the statement: Swaraj is my birthright and " +
        "I shall have it."
    ],

    8: [
        "Satyameva Jayate means Truth Alone Triumphs and is India's national " +
        "motto. Other famous patriotic expressions include Jai Jawan, Jai " +
        "Kisan and Jai Hind."
    ],

    9: [
        "Jana Gana Mana is the national anthem of India."
    ],

    10: [
        "India has a long and diverse history.\n\n" +
        "Ancient India included the Indus Valley Civilization, " +
        "the Vedic period, the Maurya Empire, and the Gupta Empire.\n\n" +
        "Medieval India saw the Delhi Sultanate."
    ],

    11: [
        "Rabindranath Tagore was a famous Indian poet, writer and philosopher. " +
        "He wrote Jana Gana Mana and received the Nobel Prize in Literature " +
        "for Gitanjali."
    ],

    12: [
        "Rani Laxmibai, also known as Jhansi Ki Rani, was the queen of Jhansi " +
        "and became one of the most famous figures of the Indian Rebellion " +
        "of 1857."
    ],

    13: [
        "I am doing great! I am excited to talk about India's history."
    ],

    14: [
        "I am BharatBot. I am here to tell you about India's independence, " +
        "freedom fighters, national symbols, and history."
    ],

    15: [
        "The Constitution of India came into effect on 26 January 1950. " +
        "Dr. B. R. Ambedkar chaired the Drafting Committee."
    ],

    16: [
        "British control over India developed gradually rather than " +
        "starting on one single date.\n\n" +

        "The English East India Company gained major political power " +
        "after the Battle of Plassey in 1757 and expanded its control " +
        "over more parts of India during the following decades.\n\n" +

        "After the Revolt of 1857, the British Crown took direct control " +
        "from the East India Company in 1858. This period is known as " +
        "the British Raj.\n\n" +

        "British rule ended when India became independent on " +
        "15 August 1947."
    ],

    17: [
        "India is especially well known for black pepper, which has " +
        "been traded from the Malabar Coast for centuries.\n\n" +

        "India is also famous for spices such as cardamom, turmeric, " +
        "cumin, coriander, cloves, cinnamon, and saffron.\n\n" +

        "Indian spices have played an important role in Indian cuisine " +
        "and in the history of international trade."
    ],

    18: [
        "Yes. India and Pakistan became separate countries in 1947 " +
        "during the Partition of British India.\n\n" +

        "The Partition took place when British rule ended. " +
        "Pakistan became independent on 14 August 1947, while India " +
        "became independent on 15 August 1947.\n\n" +

        "The Partition caused one of the largest mass migrations in " +
        "modern history and led to widespread violence and suffering."
    ],

    19: [
        "British traders first came to India mainly for trade. " +
        "They were interested in valuable goods such as spices, " +
        "cotton textiles, silk, and other products.\n\n" +

        "The English East India Company established trading posts " +
        "and gradually became involved in Indian politics and conflicts.\n\n" +

        "Over time, the Company gained military and political power " +
        "and expanded its control over large parts of India.\n\n" +

        "After the Revolt of 1857, the British Crown took direct " +
        "control of India in 1858. This period became known as the " +
        "British Raj.\n\n" +

        "British rule ended when India became independent on " +
        "15 August 1947."
    ]
};

// ============================================================
// TF-IDF
// ============================================================

const tfidf = new natural.TfIdf();

for (const sentence of trainingSentences) {
    tfidf.addDocument(sentence);
}


// Create vocabulary
const vocabulary = new Set();

for (const sentence of trainingSentences) {
    const words = sentence
        .toLowerCase()
        .split(/\s+/);

    for (const word of words) {
        vocabulary.add(word);
    }
}

const words = [...vocabulary];


// Convert text → numbers
function vectorize(text) {

    const vector = new Array(words.length).fill(0);

    const tokens = text
        .toLowerCase()
        .split(/\s+/);

    for (let i = 0; i < words.length; i++) {

        if (tokens.includes(words[i])) {
            vector[i] = 1;
        }
    }

    return vector;
}


// ============================================================
// LOGISTIC REGRESSION
// ============================================================

const X = trainingSentences.map(vectorize);

const classifier = new LogisticRegression({
    numSteps: 1000,
    learningRate: 5e-3
});

classifier.train(X, trainingLabels);


// ============================================================
// PREDICTION
// ============================================================

function classify(question) {

    const vector = vectorize(question);

    const prediction = classifier.predict([vector]);

    return prediction[0];
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    classify
};