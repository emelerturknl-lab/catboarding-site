(function() {
    const MUSIC_VERSION = "music-v6";

    // 1. VERSION RESET & MIGRATION
    if (localStorage.getItem("bgMusic_version") !== MUSIC_VERSION) {
        localStorage.removeItem("bgMusic_playing");
        localStorage.removeItem("bgMusic_manual_pause");
        localStorage.removeItem("bgMusic_time");
        localStorage.removeItem("bgMusic_index");
        localStorage.removeItem("bgMusic_shuffledPlaylist");
        sessionStorage.removeItem("bgMusic_manual_pause");
        localStorage.setItem("bgMusic_version", MUSIC_VERSION);
    }

    // 2. PREVENT DUPLICATE UI
    const existing = document.getElementById('bg-music-control');
    if (existing) existing.remove();

    const basePath = '/assets/audio/playlist/';
    const rawPlaylist = [
        "ES_A Day to Remember - River Run Dry.mp3",
        "ES_A Tiny Tumble - Josef Falkenskold.mp3",
        "ES_All About Toys - Stationary Sign.mp3",
        "ES_Alleys of Buenos Aires - Tiki Tiki.mp3",
        "ES_Another Spring Will Come - Sight of Wonders.mp3",
        "ES_Ay Amor (Instrumental Version) - Caro Luna.mp3",
        "ES_Azure Ozones - MIUT.mp3",
        "ES_Better Days Ahead - Dez Moran.mp3",
        "ES_Break Fast - Jules Gaia.mp3",
        "ES_Bulls - Mary Riddle.mp3",
        "ES_Bumper Car Ride - The Fly Guy Five.mp3",
        "ES_Campfire Blues - Erik Fernholm.mp3",
        "ES_Casa Placido - Tusabe.mp3",
        "ES_Charazak - Rymdklang Soundtracks.mp3",
        "ES_Charlie on Baker Street - Eight Bits.mp3",
        "ES_Chased by the Dog - Stationary Sign.mp3",
        "ES_Ciao Ciao - Trabant 33.mp3",
        "ES_Clever Girl - Jules Gaia.mp3",
        "ES_Coasting the Coast - Martin Klem.mp3",
        "ES_Desert Heat - Mike Franklyn.mp3",
        "ES_Divertimento In F Major, K. 138 'Salzburg Symphony No. 3'_ III. Presto - W. A. Mozart.mp3",
        "ES_Don't Look at Me - Tiki Tiki.mp3",
        "ES_Don't Take Me Seriously - Claude Signet.mp3",
        "ES_Excalibur - Kevin Dailey.mp3",
        "ES_Extravaganza - Jules Gaia.mp3",
        "ES_Fat and Muscles - Martin Landstrom.mp3",
        "ES_Freezing Hands Meet Piano - Harry Edvino.mp3",
        "ES_Funny Discoveries - J.F. Gloss.mp3",
        "ES_Glitz At The Ritz - Jules Gaia.mp3",
        "ES_Hot Air Balloons - Erik Fernholm.mp3",
        "ES_Hot Club Deluxe - Rune Dale.mp3",
        "ES_In a Distant Future - Rikard From.mp3",
        "ES_Laranja - Tusabe.mp3",
        "ES_Lazy Day (Instrumental Version) - Nashional.mp3",
        "ES_Leaving Home - Sam Rankin.mp3",
        "ES_Let's Bounce - Jules Gaia.mp3",
        "ES_Maracuja - Tusabe.mp3",
        "ES_Martha's Song (Instrumental Version) - Roy Williams.mp3",
        "ES_Midnight Swing - Jules Gaia.mp3",
        "ES_Monkey Business - Mike Franklyn.mp3",
        "ES_Move Like This - Jules Gaia.mp3",
        "ES_My Kitty Cat (Instrumental Version) - Luna The Cat.mp3",
        "ES_Oumou - Balafola Suedi.mp3",
        "ES_Overstone - West & Zander.mp3",
        "ES_Own Tonight - Craig Reever.mp3",
        "ES_Pardon My French - Eva Hummingbird.mp3",
        "ES_Playful Pianist - Radio Night.mp3",
        "ES_Preschool - Josef Falkenskold.mp3",
        "ES_Rodeo Rookie - The Fly Guy Five.mp3",
        "ES_SOS - Tusabe.mp3",
        "ES_Sanity - Mansa.mp3",
        "ES_Silent Story Unfolding - Sight of Wonders (1).mp3",
        "ES_Silent Story Unfolding - Sight of Wonders.mp3",
        "ES_Smiling Sun - Mike Franklyn.mp3",
        "ES_Strings and Savories - Jo Wandrini.mp3",
        "ES_Summer Lilac - Bonsaye.mp3",
        "ES_Sunny Days Ahead - Speedy The Spider.mp3",
        "ES_Sunshine Stroll - Mike Franklyn.mp3",
        "ES_Swagger Stagger - Lucas Pittman.mp3",
        "ES_Terra - Lukas Got Lucky.mp3",
        "ES_That's Fine (Instrumental Version) - Nashional.mp3",
        "ES_The Flow - Martin Landstrom.mp3",
        "ES_The Happy Customer - The Fly Guy Five.mp3",
        "ES_The Script - Plain Strolls.mp3",
        "ES_Thieving Squirrels - The Fly Guy Five.mp3",
        "ES_Tiny Pockets - The Fly Guy Five.mp3",
        "ES_Tukan - West & Zander.mp3",
        "ES_Up for Grabs - Mike Franklyn.mp3",
        "ES_Vivaldi_ The Four Seasons, Violin Concerto in F Major, Op. 8 No. 3, RV 293 _Autumn__ III. Allegro _La caccia_ - Michelle Ross.mp3",
        "ES_Where the Flowers Grow - Dez Moran.mp3",
        "ES_Who Took My Tooth_ - The Fly Guy Five.mp3",
        "ES_Winding Paths - J.F. Gloss.mp3",
        "ES_Wishy Washy - Jerry Lacey.mp3",
        "ES_You See My Soul - Lukas Amil.mp3",
        "ES_hjortron - bomull.mp3",
        "Yeni Kayıt 76.m4a",
        "Yeni Kayıt 77.m4a",
        "another_spring.mp3",
        "azure_ozones.mp3",
        "better_days_ahead.mp3",
        "casa_placido.mp3",
        "coasting.mp3",
        "freezing_hands_piano.mp3",
        "in_a_distant_future.mp3",
        "laranja.mp3",
        "lazy_day.mp3",
        "leaving_home.mp3",
        "luna_track.mp3",
        "maracuja.mp3",
        "overstone.mp3",
        "playful_pianist.mp3",
        "playful_piano.mp3",
        "river_run_dry.mp3",
        "sanity.mp3",
        "silent_story.mp3",
        "smiling_sun.mp3",
        "sos.mp3",
        "summer_lilac.mp3",
        "sunshine_stroll.mp3",
        "terra.mp3",
        "the_script.mp3",
        "tiny_tumble.mp3",
        "tukan.mp3",
        "winding_paths.mp3"
    ].map(name => basePath + name);

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // 3. PERSISTENCE
    let shuffledPlaylist = JSON.parse(localStorage.getItem('bgMusic_shuffledPlaylist'));
    if (!shuffledPlaylist || shuffledPlaylist.length !== rawPlaylist.length) {
        shuffledPlaylist = shuffle([...rawPlaylist]);
        localStorage.setItem('bgMusic_shuffledPlaylist', JSON.stringify(shuffledPlaylist));
    }

    let currentTrackIndex = parseInt(localStorage.getItem('bgMusic_index')) || 0;
    if (currentTrackIndex >= shuffledPlaylist.length) currentTrackIndex = 0;

    const audio = new Audio();
    audio.volume = 0.4;
    audio.loop = false;
    audio.src = shuffledPlaylist[currentTrackIndex];

    const savedTime = parseFloat(localStorage.getItem('bgMusic_time')) || 0;

    // 4. UI CONSTRUCTION
    const musicBtn = document.createElement('div');
    musicBtn.id = 'bg-music-control';
    musicBtn.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; width: 45px; height: 45px;
        background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px);
        border: 1px solid rgba(217, 163, 163, 0.5); border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; z-index: 999999; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: all 0.3s ease; font-size: 20px; pointer-events: auto;
    `;
    document.body.appendChild(musicBtn);

    function updateUI() {
        const isManualPause = sessionStorage.getItem('bgMusic_manual_pause') === 'true';
        musicBtn.innerHTML = isManualPause ? '<span style="pointer-events:none;">🔇</span>' : '<span class="music-playing" style="pointer-events:none;">🎵</span>';
        musicBtn.style.background = isManualPause ? 'rgba(255, 255, 255, 0.8)' : 'rgba(217, 163, 163, 0.2)';
    }

    // 5. CORE PLAYBACK
    async function safePlay() {
        if (sessionStorage.getItem('bgMusic_manual_pause') === 'true') return false;
        try {
            await audio.play();
            updateUI();
            return true;
        } catch (err) {
            console.warn("🎵 Music Player: Playback failed/blocked:", err.message);
            updateUI();
            return false;
        }
    }

    function playNext() {
        currentTrackIndex++;
        if (currentTrackIndex >= shuffledPlaylist.length) {
            currentTrackIndex = 0;
            shuffledPlaylist = shuffle([...rawPlaylist]);
            localStorage.setItem('bgMusic_shuffledPlaylist', JSON.stringify(shuffledPlaylist));
        }
        audio.src = shuffledPlaylist[currentTrackIndex];
        localStorage.setItem('bgMusic_index', currentTrackIndex);
        localStorage.setItem('bgMusic_time', 0);
        safePlay();
    }

    audio.addEventListener('ended', playNext);

    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem('bgMusic_time', audio.currentTime);
        }
    }, 1000);

    // 6. INTERACTION FALLBACK
    const interactionEvents = ['click', 'touchstart', 'keydown', 'pointerdown'];
    
    const startOnInteraction = async () => {
        if (sessionStorage.getItem('bgMusic_manual_pause') === 'true') {
            removeInteractionListeners();
            return;
        }

        const success = await safePlay();
        if (success) {
            console.log("🎵 Music Player: Started via user interaction.");
            removeInteractionListeners();
        }
    };

    function removeInteractionListeners() {
        interactionEvents.forEach(evt => window.removeEventListener(evt, startOnInteraction));
    }

    interactionEvents.forEach(evt => window.addEventListener(evt, startOnInteraction));

    // 7. CONTROL TOGGLE
    musicBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (audio.paused) {
            sessionStorage.removeItem("bgMusic_manual_pause");
            const success = await safePlay();
            if (!success) {
                audio.load();
                await safePlay();
            }
        } else {
            audio.pause();
            sessionStorage.setItem("bgMusic_manual_pause", "true");
        }
        updateUI();
    });

    // 8. INITIAL LOAD
    window.addEventListener('load', () => {
        audio.currentTime = savedTime;
        safePlay();
        updateUI();
        console.log("🎵 Music Player: VERSION " + MUSIC_VERSION + " active.");
    });

    // CSS STYLING
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes musicWave { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .music-playing { display: inline-block; animation: musicWave 1.5s infinite ease-in-out; }
        #bg-music-control:hover { transform: scale(1.1); border-color: #D9A3A3; }
    `;
    document.head.appendChild(style);

})();
