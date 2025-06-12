// src/modules/services/gascustom.ts

import { TranslateTaskProcessor } from "../../utils/task";

export default <TranslateTaskProcessor>async function (data) {
  // secretフィールドにGASのウェブアプリURLが格納されていると想定
  const url = data.secret;

  // GASに送信するリクエストボディ
  const reqBody = JSON.stringify({
    text: data.raw,
    source: data.langfrom.split("-")[0], // 'en-US' -> 'en'
    target: data.langto.split("-")[0],   // 'ja-JP' -> 'ja'
  });

  const xhr = await Zotero.HTTP.request("POST", url, {
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
    body: reqBody,
  });

  if (xhr?.status !== 200) {
    throw `Request error: ${xhr?.status}`;
  }
  
  // GASからのレスポンスを処理
  if (xhr.response.code !== 200) {
      throw `Service error: ${xhr.response.code}: ${xhr.response.text}`;
  }
  
  data.result = xhr.response.text;
};