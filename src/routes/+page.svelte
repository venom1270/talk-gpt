<script>
    import './styles.css';

    let LANG_RECOGNITION = "en"; 
    let LANG_UTTERANCE = "en"; 

    let languages = [
        { id: "en", text: "English" },
        { id: "sl", text: "Slovenian (experimental)" }
    ]

    let selectedLanguage = "en";

    setLanguage();

    function setLanguage() {
        console.log(selectedLanguage);
        if (selectedLanguage === "en") {
            LANG_RECOGNITION = "en"; 
            // https://stackoverflow.com/questions/39603510/speechsynthesisutterance-list-of-languages
            LANG_UTTERANCE = "en-GB"; 
            console.log("Set EN");
        } else if (selectedLanguage === "sl") {
            LANG_RECOGNITION = "sl"; 
            LANG_UTTERANCE = "pl-PL"; 
            console.log("Set SL");
        }
    }

    

    let speech = "";
    let working = false;

    let chatHistory = [];

    async function chat() {

        working = true;
        //chatHistory = [...chatHistory, "💬"];

        const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
        const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
        const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

        var recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = LANG_RECOGNITION;
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;


       
        recognition.start();

        recognition.onresult = async function(event) {
            // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
            // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
            // It has a getter so it can be accessed like an array
            // The first [0] returns the SpeechRecognitionResult at the last position.
            // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
            // These also have getters so they can be accessed like arrays.
            // The second [0] returns the SpeechRecognitionAlternative at position 0.
            // We then return the transcript property of the SpeechRecognitionAlternative object
            console.log(event);
            var color = event.results[0][0].transcript;
            speech = color;
            console.log('Confidence: ' + event.results[0][0].confidence);
            
            //chatHistory.pop();
            //chatHistory = [...chatHistory, speech, "🗨️"];
            chatHistory = [...chatHistory, speech];

            console.log("Sending to GPT...");
            let aiResponse = await tryPrompt(speech, selectedLanguage);

            //chatHistory.pop();
            chatHistory = [...chatHistory, aiResponse];
        
            let utterance = new SpeechSynthesisUtterance(aiResponse);
            utterance.lang = LANG_UTTERANCE;
            speechSynthesis.speak(utterance);

            console.log(chatHistory)

            working = false;

        }

        recognition.onspeechend = function() {
            recognition.stop();
        }

        recognition.onerror = function(event) {
            speech = 'Error occurred in recognition: ' + event.error;
            working = false;
            //chatHistory.pop();
            //chatHistory = chatHistory;
        }
    }



    async function tryPrompt(prompt, language) {
        
        const response = await fetch('/', {
            method: 'POST',
            body: JSON.stringify({ prompt, language }),
            headers: {
                'content-type': 'application/json'
            }
        });


        let responseData = await response.json()


        if (typeof responseData === "string") {
            console.log("Error...", responseData);
            return "";
        } else {
            return responseData.choices[0].message?.content;
        }
        
	}



</script>

<svelte:head>
	<title>TalkGPT</title>
	<meta name="description" content="TalkGPT app" />
</svelte:head>

<main>
    <h1>🧑💬 TalkGPT 🗨️🤖</h1>

    <div>
        
        
        <input type="button" value="Talk" on:click={chat} disabled={working} />
        <br/>
        <select bind:value={selectedLanguage} on:change={setLanguage} style="margin-top: 5px;">
            {#each languages as language}
                <option value={language.id}>
                    {language.text}
                </option>
            {/each}
        </select>

        <span>{speech}</span>
    
        <pre class="chatBox">
            {#each chatHistory as dialogueLine, i}
                {#if i % 2 == 0}
                    <div class="chatHuman">{dialogueLine}</div>
                {:else}
                    <div class="chatRobot">{dialogueLine}</div>
                {/if}
            {/each}
            {#if working}
                {#if chatHistory.length % 2 == 0}
                    <div class="chatHuman emoji">💬</div>
                {:else}
                    <div class="chatRobot emoji">🗨️</div>
                {/if}
            {/if}
        </pre>
        
    
    </div>
</main>



    
