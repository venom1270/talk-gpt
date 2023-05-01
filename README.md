# 🧑💬 TalkGPT 🗨️🤖

A simple speech interface app for GPT.

It uses the standard [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for speech-to-text and text-to-speech. And of course, GPT3.5 as the core AI model.

Currently fully supports only English and Slovenian. For Slovene I'm using Polish text-to-speech setting (Slovenian voice is unsupported) - that's why it's marked as experimental.

The model has no context of chat history - each line/prompt is completely independent.