// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config();
const app = express();


const cors = require('cors');
app.use(cors()); 


const port = process.env.PORT || 3015;
const API_KEY = process.env.API_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

app.use(express.json());
const MODEL_NAME = "gemini-pro";
 

let chat; // Declare chat globally

function initializeChatModel() {
  
 
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [

      {
        role: "user",
        parts: [{ text: '  you are a Shopping  assistant your goal is to help  user choose desired  product after analysing  purchase history and user data after asking sufficient questions  PurchaseArrayDescriptions = [Product names, Brands, Models, Prices (in Rupees), Types, Purposes];    purchaseHistory = [["Sony Noise-Canceling Headphones", "Sony", "WH-1000XM4", 15000, "Electronics", "Audio Quality and Noise Isolation"],["Apple MacBook Pro", "Apple", "MacBook Pro 13-inch", 120000, "Electronics", "Productivity and Design"],["Nike Air Zoom Pegasus Running Shoes", "Nike", "Air Zoom Pegasus 38", 8000, "Footwear", "Athletic Performance"],["Amazon Echo Dot (4th Gen)", "Amazon", "Echo Dot (4th Gen)", 3000, "Electronics", "Convenience and Entertainment"],["Canon EOS Rebel T7i DSLR Camera", "Canon", "EOS Rebel T7i", 50000, "Electronics", "Photography"],["KitchenAid Stand Mixer", "KitchenAid", "Artisan Series", 25000, "Appliances", "Kitchen Convenience"]] '}],
      },
      {
        role: "model",
        parts: [{ text: "can u give me user details "}],
      },

      {
        role: "user",
        parts: [{ text: '  UserData={name:"Danish Sharma"  , height:"6feet" , age:"21" ,  weight:"85kg" , body:"Muscular lean body " ,activities:"gym , calisthenics, sports , college , software Engineer", preferences:"plain colors with less graphics"  , size:{shoes:9 , upper:"XL" , waist,"32" , chest"44" ,FavouriteBrand:"Nike , Fossil , RedTape" }}' ,}],
      },
      {
        role: "model",
        parts: [{ text: "I  will ask u small question and strictly recomend one product (may recomend anpther if user not satisfied ) enclose product name  in {{product}} curly brackets  and all responses from me would be short and precise "}],
      },
    ],
  });
 
}











async function searchAmazonData(query) {
  const options = {
    method: 'GET',
    url: 'https://real-time-amazon-data.p.rapidapi.com/search',
    params: {
      query: query,
      page: '1',
      country: 'IN',
      sort_by: 'RELEVANCE',
      category_id: 'aps',
      // min_price: minPrice.toString(),
      // max_price: maxPrice.toString()
    },
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data.data.products[0]);
    const item = response.data.data.products[0] ; 

    return item;  
  } catch (error) {
    console.error(error);
    throw error; // You might want to handle the error or rethrow it as needed
  }
}

// Initialize chat model before any routes


app.get('/', (req, res) => {
  initializeChatModel();
  console.log("new chat");
  res.status(200).send("Success");
});


app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const result = await chat.sendMessage(userInput);
    const response = result.response.text();
    console.log(response);
    res.json({ response: response  });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/product', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /product req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const result = await searchAmazonData(userInput);
   
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
