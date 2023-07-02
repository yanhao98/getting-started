import axios, { type AxiosRequestConfig } from "axios";
import { v4 as uuidv4 } from "uuid";

// ================================================================================

export async function translate(text: string) {
  let config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://pandora.yanhao.ren/api/conversation/talk",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      prompt: `将以下文本翻译为 英语：\n${text}`,
      message_id: uuidv4(),
      conversation_id: "64e7d92d-5493-4124-9051-dbbd3b49c44d",
      parent_message_id: "3b5eceea-c5b7-4357-aee9-54c3b2d38788",
      model: "text-davinci-002-render-sha",
      timezone_offset_min: -480,
    },
  };

  const response = await axios.request(config);
  console.debug(
    "================================================================================"
  );
  const dataLines = (response.data.split("\n\n") as string[]).filter(
    (line) => line !== "" && line !== "data: [DONE]"
  );
  const dataStr = dataLines[dataLines.length - 1];
  if (dataStr) {
    const data = JSON.parse(dataStr.replace("data: ", ""));
    const parts = data.message.content.parts as string[];
    return parts;
  } else {
    throw new Error("No data");
  }
}

// translate("你好");
