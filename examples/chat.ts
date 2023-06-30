import axios, { AxiosError, AxiosRequestConfig } from "axios";

// ================================================================================
let data = JSON.stringify({
  prompt: "你好。",
  message_id: "757c06dc-3ab4-4ccb-a11e-79ff6495a12a",
  parent_message_id: "",
  // model: "gpt-4-mobile",
  model: "text-davinci-002-render-sha",
  timezone_offset_min: -480,
});

let config: AxiosRequestConfig = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://pandora.yanhao.ren/api/conversation/talk",
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
  responseType: "stream",
};

axios
  .request(config)
  .then((response) => {
    console.debug(
      "================================================================================"
    );

    const stream = response.data;
    const chunks: any[] = [];
    stream.on("data", (data: Buffer) => {
      // console.debug('================================================================================');
      // console.debug("data :>> ", data);
      // Buffer 到 String
      // console.debug('data.toJSON() :>> ', data.toJSON());
      // console.debug("data.toString() :>> ", data.toString());
      // console.debug('JSON.parse(data.toString()) :>> ', JSON.parse(data.toString()));
      chunks.push(data);
    });

    stream.on("end", () => {
      console.log("stream done");
      const buffer = Buffer.concat(chunks);
      console.debug('================================================================================');
      console.debug('buffer.toString() :>> ', buffer.toString());
      console.debug('================================================================================');
      console.debug('buffer.length :>> ', buffer.length);
      console.debug('================================================================================');
      const responseText = buffer.toString();
     /*
     , "conversation_id": "a93e91eb-f687-46d9-8d81-81ecf3fb9970", "error": null}

data: {"message": {"id": "6cf10b1e-3cfe-464d-9fdc-a41801553e59", "author": {"role": "assistant", "name": null, "metadata": {}}, "create_time": 1688103145.434571, "update_time": null, "content": {"content_type": "text", "parts": ["\u4f60\u597d\uff01\u6709\u4ec0\u4e48\u6211\u53ef\u4ee5\u5e2e\u52a9\u4f60\u7684\u5417\uff1f"]}, "status": "finished_successfully", "end_turn": true, "weight": 1.0, "metadata": {"message_type": "next", "model_slug": "text-davinci-002-render-sha", "finish_details": {"type": "stop", "stop": "<|diff_marker|>"}}, "recipient": "all"}, "conversation_id": "a93e91eb-f687-46d9-8d81-81ecf3fb9970", "error": null}

data: [DONE]


     */
    // 取出最后一个 data: { 到 最后一个 } 之间的内容
    const lastData = responseText.match(/data: {(.*)}/);
    console.debug('lastData :>> ', lastData);
    });

    // console.log(JSON.stringify(response.data));
    // console.debug(JSON.parse(JSON.stringify(response.data)));
    // console.debug(response.data);
    // console.debug(typeof response.data);
  })
  .catch((error: AxiosError) => {
    console.debug('error.message :>> ', error.message);
    // console.error(error);
    // console.debug('error.response?.status :>> ', error.response?.status);
  });

// ================================================================================
