const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const axios = require("axios");


const databaseUrl = "https://toppick-ai-default-rtdb.firebaseio.com/";
// const apiKey = "sk-71M97G0FiL7HDp47XeDAGCi87oj2J1Ll14k3zokvpW3pYRF8";
// const apiKey = functions.config().stability.api_key;


// Firebase Admin 초기화
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseUrl,
});

const app = express();

// CORS 설정 추가
app.use(cors({
  origin: "https://toppick-ai.web.app", // 이 부분을 프론트엔드 배포 URL로 변경하세요.
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

// Stable Diffusion API 엔드포인트
app.post("/api/generate-image", async (req, res) => {
  const apiKey = process.env.STABILITY_API_KEY;
  try {
    const {prompt} = req.body;
    console.log(prompt);

    // 프롬프트의 각 단어 카운트 증가
    const words = prompt.split(",")
        .map((word) => word.trim())
        .filter((word) => word);
    const db = admin.database();
    const wordCountsRef = db.ref("wordCounts");

    // 트랜잭션으로 단어 카운트 업데이트
    for (const word of words) {
      const wordRef = wordCountsRef.child(word);
      await wordRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
      });
    }

    // Stable Diffusion API 호출
    const response = await axios.post("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
      text_prompts: [
        {
          text: prompt,
          weight: 1,
        },
      ],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30,
    }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    // 생성된 이미지 데이터 반환
    res.json({
      success: true,
      image: response.data.artifacts[0].base64,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({
      success: false,
      error: "이미지 생성 중 오류가 발생했습니다.",
    });
  }
});

exports.api = functions.https.onRequest(app);
