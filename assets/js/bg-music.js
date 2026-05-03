
(function() {
    const playlist = [
        "playlist/ES_Glitz At The Ritz - Jules Gaia.mp3",
        "playlist/ES_Sunshine Stroll - Mike Franklyn.mp3",
        "playlist/ES_Vivaldi_ The Four Seasons, Violin Concerto in F Major, Op. 8 No. 3, RV 293 _Autumn__ III. Allegro _La caccia_ - Michelle Ross.mp3",
        "playlist/ES_Monkey Business - Mike Franklyn.mp3",
        "playlist/ES_Funny Discoveries - J.F. Gloss.mp3",
        "playlist/ES_Better Days Ahead - Dez Moran.mp3",
        "playlist/ES_Another Spring Will Come - Sight of Wonders.mp3",
        "playlist/ES_Divertimento In F Major, K. 138 'Salzburg Symphony No. 3'_ III. Presto - W. A. Mozart.mp3",
        "playlist/ES_Let's Bounce - Jules Gaia.mp3",
        "playlist/ES_Extravaganza - Jules Gaia.mp3",
        "playlist/ES_Silent Story Unfolding - Sight of Wonders.mp3",
        "playlist/ES_Winding Paths - J.F. Gloss.mp3",
        "playlist/ES_Maracuja - Tusabe.mp3",
        "playlist/ES_Ciao Ciao - Trabant 33.mp3",
        "playlist/ES_Strings and Savories - Jo Wandrini.mp3",
        "playlist/ES_All About Toys - Stationary Sign.mp3",
        "playlist/ES_A Tiny Tumble - Josef Falkenskold.mp3",
        "playlist/ES_Playful Pianist - Radio Night.mp3",
        "playlist/ES_Freezing Hands Meet Piano - Harry Edvino.mp3",
        "playlist/ES_Midnight Swing - Jules Gaia.mp3",
        "playlist/ES_Hot Club Deluxe - Rune Dale.mp3",
        "playlist/ES_Azure Ozones - MIUT.mp3",
        "playlist/ES_Terra - Lukas Got Lucky.mp3",
        "playlist/ES_Break Fast - Jules Gaia.mp3",
        "playlist/ES_Move Like This - Jules Gaia.mp3",
        "playlist/ES_Clever Girl - Jules Gaia.mp3",
        "playlist/ES_Smiling Sun - Mike Franklyn.mp3",
        "playlist/ES_Summer Lilac - Bonsaye.mp3",
        "playlist/ES_That's Fine (Instrumental Version) - Nashional.mp3",
        "playlist/ES_The Happy Customer - The Fly Guy Five.mp3",
        "playlist/ES_Alleys of Buenos Aires - Tiki Tiki.mp3",
        "playlist/ES_Bumper Car Ride - The Fly Guy Five.mp3",
        "playlist/ES_Charazak - Rymdklang Soundtracks.mp3",
        "playlist/ES_Charlie on Baker Street - Eight Bits.mp3",
        "playlist/ES_Chased by the Dog - Stationary Sign.mp3",
        "playlist/ES_Desert Heat - Mike Franklyn.mp3",
        "playlist/ES_Don't Look at Me - Tiki Tiki.mp3",
        "playlist/ES_Excalibur - Kevin Dailey.mp3",
        "playlist/ES_Pardon My French - Eva Hummingbird.mp3",
        "playlist/ES_Sunny Days Ahead - Speedy The Spider.mp3",
        "playlist/ES_Swagger Stagger - Lucas Pittman.mp3",
        "playlist/ES_The Flow - Martin Landstrom.mp3",
        "playlist/ES_Tiny Pockets - The Fly Guy Five.mp3",
        "playlist/ES_Up for Grabs - Mike Franklyn.mp3",
        "playlist/ES_Where the Flowers Grow - Dez Moran.mp3",
        "playlist/ES_You See My Soul - Lukas Amil.mp3"
    ];

    // Shuffle logic to ensure variety
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // Shuffle the playlist once per session if not already set
    let shuffledPlaylist = JSON.parse(sessionStorage.getItem('bgMusic_shuffledPlaylist'));
    if (!shuffledPlaylist) {
        shuffledPlaylist = shuffle([...playlist]);
        sessionStorage.setItem('bgMusic_shuffledPlaylist', JSON.stringify(shuffledPlaylist));
    }
    
    const activePlaylist = shuffledPlaylist;

    let currentTrackIndex = parseInt(localStorage.getItem('bgMusic_index')) || 0;
    let audio = new Audio();
    audio.src = activePlaylist[currentTrackIndex];
    audio.loop = false;
    audio.volume = 0.4; // Subtle volume

    // Load saved state
    const savedTime = parseFloat(localStorage.getItem('bgMusic_time')) || 0;
    const isPlaying = localStorage.getItem('bgMusic_playing') === 'true';

    // UI Element for Control
    const musicBtn = document.createElement('div');
    musicBtn.id = 'bg-music-control';
    musicBtn.innerHTML = '<span class="icon">🎵</span>';
    musicBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 45px;
        height: 45px;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(217, 163, 163, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        font-size: 20px;
    `;

    document.body.appendChild(musicBtn);

    function updateIcon() {
        musicBtn.innerHTML = audio.paused ? '<span>🔇</span>' : '<span class="music-playing">🎵</span>';
        if (!audio.paused) {
            musicBtn.style.background = 'rgba(217, 163, 163, 0.2)';
            musicBtn.classList.add('playing');
        } else {
            musicBtn.style.background = 'rgba(255, 255, 255, 0.8)';
            musicBtn.classList.remove('playing');
        }
    }

    function playTrack(index) {
        if (index >= activePlaylist.length) index = 0;
        currentTrackIndex = index;
        audio.src = activePlaylist[index];
        localStorage.setItem('bgMusic_index', index);
        audio.play().catch(e => console.log("Playback delayed until interaction."));
    }

    audio.addEventListener('ended', function() {
        playTrack(currentTrackIndex + 1);
    });

    // Save state periodically
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem('bgMusic_time', audio.currentTime);
            localStorage.setItem('bgMusic_playing', 'true');
        } else {
            localStorage.setItem('bgMusic_playing', 'false');
        }
    }, 1000);

    // Initial Play on Interaction
    const startMusic = () => {
        // If it was explicitly paused by user, don't auto-start
        if (localStorage.getItem('bgMusic_manual_pause') === 'true') {
            return;
        }

        if (audio.paused) {
            audio.play().then(() => {
                updateIcon();
                localStorage.setItem('bgMusic_playing', 'true');
                localStorage.setItem('bgMusic_interaction', 'true');
                removeListeners();
            }).catch(e => {
                // Autoplay still blocked or failed, keep listeners
            });
        } else {
            // Already playing, can remove listeners
            removeListeners();
        }
    };

    const removeListeners = () => {
        ['click', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
            window.removeEventListener(evt, startMusic);
        });
    };

    // Attach listeners for first interaction
    ['click', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
        window.addEventListener(evt, startMusic, { once: false });
    });

    // Try to play immediately on load (some browsers might allow it if recently interacted)
    window.addEventListener('load', () => {
        audio.currentTime = savedTime;
        // If it was playing on previous page, try to resume
        if (isPlaying) {
            audio.play().then(updateIcon).catch(e => {
                console.log("Autoplay blocked on load. Waiting for interaction.");
            });
        }
    });

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.paused) {
            audio.play().then(() => {
                localStorage.setItem('bgMusic_playing', 'true');
                localStorage.setItem('bgMusic_manual_pause', 'false');
                updateIcon();
            });
        } else {
            audio.pause();
            localStorage.setItem('bgMusic_playing', 'false');
            localStorage.setItem('bgMusic_manual_pause', 'true');
            updateIcon();
        }
    });

    // CSS Animation for the icon
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes musicWave {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        .music-playing {
            display: inline-block;
            animation: musicWave 1.5s infinite ease-in-out;
        }
        #bg-music-control:hover {
            transform: scale(1.1);
            border-color: #D9A3A3;
        }
    `;
    document.head.appendChild(style);

})();
