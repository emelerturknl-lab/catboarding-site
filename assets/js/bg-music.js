
(function() {
    const playlist = [
        "playlist/another_spring.mp3",
        "playlist/azure_ozones.mp3",
        "playlist/better_days_ahead.mp3",
        "playlist/casa_placido.mp3",
        "playlist/coasting.mp3",
        "playlist/freezing_hands_piano.mp3",
        "playlist/in_a_distant_future.mp3",
        "playlist/laranja.mp3",
        "playlist/lazy_day.mp3",
        "playlist/leaving_home.mp3",
        "playlist/luna_track.mp3",
        "playlist/maracuja.mp3",
        "playlist/overstone.mp3",
        "playlist/playful_pianist.mp3",
        "playlist/playful_piano.mp3",
        "playlist/river_run_dry.mp3",
        "playlist/sanity.mp3",
        "playlist/silent_story.mp3",
        "playlist/smiling_sun.mp3",
        "playlist/sos.mp3",
        "playlist/summer_lilac.mp3",
        "playlist/sunshine_stroll.mp3",
        "playlist/terra.mp3",
        "playlist/the_script.mp3",
        "playlist/tiny_tumble.mp3",
        "playlist/tukan.mp3",
        "playlist/winding_paths.mp3"
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
