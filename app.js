const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// Function to make Jarvis speak
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

// Function to greet the user based on time of day
function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

// Initialize Jarvis
window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

// Set up speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false; // Stop listening after one command
recognition.interimResults = false; // Only final results
recognition.lang = 'en-US'; // Set language to English

// Handle speech recognition results
recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

// Handle errors in speech recognition
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    speak("Sorry, I didn't catch that. Could you please repeat?");
    content.textContent = "Error: " + event.error;
};

// Start listening when the button is clicked
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

// Function to handle user commands
function takeCommand(message) {
    console.log("User said:", message); // Log the user's command for debugging

    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes('how are you')) {
        speak("I'm doing great, thank you! How about you?");
    } else if (message.includes('tell me a joke')) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(joke);
    } else if (message.includes('open google')) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes('open youtube')) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes('open facebook')) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        const query = message.replace("what is", "").replace("who is", "").replace("what are", "").trim();
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        speak(`This is what I found on the internet regarding ${query}`);
    } else if (message.includes('wikipedia')) {
        const query = message.replace("wikipedia", "").trim();
        window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank");
        speak(`This is what I found on Wikipedia regarding ${query}`);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The current time is ${time}`);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak(`Today's date is ${date}`);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        speak("Opening Calculator");
    } else if (message.includes('play music')) {
        window.open("https://music.youtube.com", "_blank");
        speak("Playing music on YouTube Music...");
    } else if (message.includes('weather')) {
        window.open("https://www.google.com/search?q=weather", "_blank");
        speak("Here's the weather forecast for your location.");
    } else if (message.includes('news')) {
        window.open("https://news.google.com", "_blank");
        speak("Here are the latest news updates.");
    } else {
        // Fetch answer from DuckDuckGo API
        fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(message)}&format=json&no_html=1&skip_disambig=1`)
            .then(response => response.json())
            .then(data => {
                if (data.AbstractText) {
                    // If DuckDuckGo provides a direct answer
                    speak(`Here's what I found: ${data.AbstractText}`);
                } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                    // If DuckDuckGo provides related topics
                    const firstTopic = data.RelatedTopics[0].Text;
                    speak(`Here's what I found: ${firstTopic}`);
                } else {
                    // If no answer is found, fallback to Google search
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
                    speak(`I couldn't find a direct answer, but I found some information for ${message} on Google.`);
                }
            })
            .catch(error => {
                console.error("Error fetching answer:", error);
                // Fallback to Google search if the API fails
                window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
                speak(`I encountered an error, but I found some information for ${message} on Google.`);
            });
    }
}