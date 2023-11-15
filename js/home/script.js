document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.querySelector('.title');
    const aboutElement = document.querySelector('.about');
    const playlistElement = document.querySelector('.box-music ul');
    const titleMusic = document.querySelector('.music-title');
    const artist = document.querySelector('.artist');
    const searchInput = document.querySelector('.search-input');
    const container = document.querySelector('.music-icons-container');
    const playPause = document.querySelector('.play-pause');
    const thumbnailImage = document.querySelector('.img-thumbnail');
    const seekBar = document.getElementById('seekBar');
    const seekbar = document.querySelector('.seekbar')
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const hideButton = document.getElementById('hideButton');
    const playMusicX = document.querySelector('.playMusic');
    const playlistX = document.querySelector('.playlist');
    const buttonDownload = document.querySelector('.download');

    let songsData = [];
    let audio = new Audio();
    let currentSong = null;

    seekbar.style.display = 'none';

    hideButton.addEventListener('click', () => {
        if (window.innerWidth <= 576) {
            playMusicX.classList.toggle('fade-in-out');
            playlistX.classList.toggle('fade-in-out');
            playMusicX.style.display = playMusicX.style.display === 'none' ? 'flex' : 'none';
            playlistX.style.display = playlistX.style.display === 'none' ? 'flex' : 'none';
        }
    });
    function updateTimeDisplay() {
        const currentTime = formatTime(audio.currentTime);
        const duration = formatTime(audio.duration);
        currentTimeDisplay.textContent = currentTime;
        durationDisplay.textContent = duration;
        seekBar.value = audio.currentTime;
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        return formattedTime;
    }

    audio.addEventListener('timeupdate', updateTimeDisplay);

    seekBar.addEventListener('input', () => {
        audio.currentTime = seekBar.value;
        updateTimeDisplay();
    });

    function createRandomIcon() {
        const icon = document.createElement('div');
        icon.classList.add('music-icon');

        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;

        icon.style.left = `${randomX}px`;
        icon.style.top = `${randomY}px`;

        container.appendChild(icon);

        moveIcon(icon);
    }

    for (let i = 0; i < 10; i++) {
        createRandomIcon();
    }

    function moveIcon(icon) {
        const randomXDirection = Math.random() < 0.5 ? -1 : 1;
        const randomYDirection = Math.random() < 0.5 ? -1 : 1;

        const animation = icon.animate(
            [
                { transform: 'translate(0, 0)' },
                { transform: `translate(${randomXDirection * 200}px, ${randomYDirection * 200}px)` }
            ],
            {
                duration: 3000,
                iterations: Infinity,
                direction: 'alternate',
                easing: 'ease-in-out'
            }
        );
    }

    function playMusic(song) {
        if (currentSong !== song) {
            currentSong = song;
            artist.textContent = song.artist;
            titleMusic.textContent = song.title;
            thumbnailImage.src = 'assets/thumbnail/' + song.thumbnail;
            thumbnailImage.alt = song.title;
            thumbnailImage.style.border = '0.7px solid #eaeaea';
            buttonDownload.src = '../../assets/images/download.png';
        
            playPause.src = '../../assets/images/loading.svg';

            if (window.innerWidth <= 576) {
                playMusicX.classList.toggle('fade-in-out');
                playlistX.classList.toggle('fade-in-out');
                playlistX.style.display = 'none';
                playMusicX.style.display = 'flex'
            }

            playPause.style.width = '4rem';
            playPause.style.cursor = 'pointer'
        
            audio.src = '../../assets/music/' + song.FileName + '.mp3';
            buttonDownload.addEventListener('click', ()=> {
                mPath = '../../assets/music/' + song.FileName + '.mp3';
                let downloadLink = document.createElement('a');
                downloadLink.href = mPath;
                downloadLink.download = song.FileName + '.mp3';
                downloadLink.click();
            });
            audio.loop = true;
            audio.addEventListener('loadeddata', () => {
                seekBar.max = audio.duration;
                seekbar.style.display = 'block';
                audio.play();
                playPause.src = '../../assets/images/pause.png';
            });
        } else {
            if (audio.paused) {
                audio.play();
                playPause.src = '../../assets/images/pause.png';
            } else {
                audio.pause();
                playPause.src = '../../assets/images/play.png';
            }
        }
    }
    
    
    function renderPlaylist(songs) {
        playlistElement.innerHTML = '';

        if (songs.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No data!';
            playlistElement.appendChild(listItem);
        } else {
            songs.forEach(song => {
                const listItem = document.createElement('li');
                const span = document.createElement('span');
                const mainText = document.createElement('div');
                mainText.textContent = `${song.title} - ${song.artist}`;
            
                listItem.appendChild(mainText);
                span.textContent = `~ ${song.duration}`;
                listItem.appendChild(span);
                playlistElement.appendChild(listItem);
            
                listItem.addEventListener('click', () => {
                    playMusic(song);
            
                    playlistElement.querySelectorAll('li').forEach(item => {
                        item.classList.remove('bgclick');
                    });
            
                    listItem.classList.add('bgclick');
                });
            });
        }
    }

    function handleSearch() {
        const keyword = searchInput.value.trim().toLowerCase();
        const filteredSongs = songsData.filter(
            song => song.title.toLowerCase().includes(keyword) || song.artist.toLowerCase().includes(keyword)
        );
        renderPlaylist(filteredSongs);
    }

    playPause.addEventListener('click', () => {
        if (currentSong) {
            playMusic(currentSong);
        }
    });

    fetch('assets/playlist.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch JSON file');
            }
            return response.json();
        })
        .then(jsonData => {
            const playlistName = jsonData.playlist.name;
            const playlistDescription = jsonData.playlist.description;

            titleElement.textContent = playlistName;
            aboutElement.textContent = playlistDescription;

            songsData = jsonData.playlist.songs;
            renderPlaylist(songsData);

            searchInput.addEventListener('input', handleSearch);
        })
        .catch(error => {
            console.error('Error fetching the file:', error);
        });
});
