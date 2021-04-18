$(function () {

    $.get("https://6075a1380baf7c0017fa69e8.mockapi.io/habib/musicplayer", function (response) {

        console.log(response)
        var songList = response;
        for (var i = 0; i < songList.length; i++) {
            songCardRendered(songList[i], i)

        }
        songPlayCard(songList[0])

        // Onclick Card Song
        $('.song-card').click(function () {
            var currentSongId = $(this).attr('id')
            songDetailsChange(currentSongId);
            localStorage.setItem('currentSongId', currentSongId)
        });

        // Next Song
        $('.next-button').click(function () {
            var currentSongId = parseInt(localStorage.getItem('currentSongId')) + 1;
            songDetailsChange(currentSongId)
            localStorage.setItem('currentSongId', currentSongId)
        });

        // Previous song
        $('.prev-button').click(function () {
            var currentSongId = parseInt(localStorage.getItem('currentSongId')) - 1;
            songDetailsChange(currentSongId)
            localStorage.setItem('currentSongId', currentSongId)
        });

        function songDetailsChange(currentSongId) {
            $('.song-album-cover').attr('src', songList[currentSongId].albumCover);
            $('.current-song-track').text(songList[currentSongId].track);
            $('.current-song-artist').text(songList[currentSongId].artist);

            $('.play-button').removeClass('far fa-play-circle')
            $('.play-button').addClass('far fa-pause-circle');
            $('.audio-class').attr('src', songList[currentSongId].file)[0].play();
        }

        // play next song automatically
        var audio = $('.audio-class')[0];
        audio.addEventListener('ended', function () {
            console.log("Song  target found!!")
            var currentSongId = parseInt(localStorage.getItem('currentSongId'));
            if (localStorage.getItem('shuffleStatus') == 'false' && (localStorage.getItem('repeatStatus') == 'false')) {
                console.log("next song played");
                localStorage.setItem('currentSongId', currentSongId + 1)
                songDetailsChange(currentSongId + 1)
            } else if (localStorage.getItem('repeatStatus') == 'true') {
                console.log("Same song played")
                localStorage.setItem('currentSongId', currentSongId)
                songDetailsChange(currentSongId)
            } else {
                var randomSongId = Math.random() * songList.length;
                randomSongId = randomSongId.toFixed();
                localStorage.setItem('currentSongId', randomSongId)
                console.log("Random song played")
                songDetailsChange(randomSongId)
            }
        });

        // Shuffle Song;
        $('.shuffle-button').click(function () {
            var shuffleStatus = localStorage.getItem('shuffleStatus');
            console.log(shuffleStatus)
            if (localStorage.getItem('repeatStatus') == 'true') {
                localStorage.setItem('repeatStatus', false);
                $('.repeat-button').removeClass('button-active')
                $('.shuffle-button').addClass('button-active')
            }

            if (shuffleStatus == 'false') {
                localStorage.setItem('shuffleStatus', true);
                console.log("shuffle-active")
                $('.shuffle-button').addClass('button-active');
            } else {
                localStorage.setItem('shuffleStatus', false);
                console.log('button-active-completed')
                $('.shuffle-button').removeClass('button-active')
            }
        })

        // Repeat Song
        $('.repeat-button').click(function () {
            if (localStorage.getItem('shuffleStatus') == 'true') {
                localStorage.setItem('shuffleStatus', false);
                $('.shuffle-button').removeClass('button-active')
                $('.repeat-button').addClass('button-active')
            }

            if (localStorage.getItem('repeatStatus') == 'false') {
                localStorage.setItem('repeatStatus', true);
                $('.repeat-button').addClass('button-active')
            } else {
                localStorage.setItem('repeatStatus', false);
                $('.repeat-button').removeClass('button-active')
            }
        })
    })



    function songCardRendered(songItem, id) {

        var rightSection = $('#right-section');
        var songCard = $("<div>").addClass('song-card').attr('id', id);

        var albumCover = $("<img>").attr('src', songItem.albumCover).addClass('album-cover');
        var artistTrackWrapper = $('<div>').addClass('artist-track-wrapper');
        var songTrack = $('<p>').addClass('song-track').text(songItem.track);
        var songArtist = $('<p>').addClass('song-artist').text(songItem.artist);


        artistTrackWrapper.append(songTrack, songArtist);
        songCard.append(albumCover, artistTrackWrapper);

        rightSection.append(songCard)
    }


    function songPlayCard(currentSong) {

        var songAlbumCover = $('<img>').addClass('song-album-cover').attr('src', currentSong.albumCover);

        var songButtonsWrapper = $('<div>').addClass('song-buttons-wrapper');
        var progressBar=$('<div>').addClass('progress-bar');
        var progressPos=$('<p>').addClass('progress-pos');
        progressBar.append(progressPos)

        var shuffleButton = $('<i>').addClass("fas fa-random shuffle-button");
        var prevButton = $('<i>').addClass("fas fa-step-backward prev-button");
        var playButton = $('<i>').addClass("far fa-play-circle play-button");
        var nextButton = $('<i>').addClass("fas fa-step-forward next-button");
        var repeatButton = $('<i>').addClass("fas fa-undo repeat-button");

        songButtonsWrapper.append(shuffleButton, prevButton, playButton, nextButton, repeatButton);

        var currentSongTrack = $('<p>').addClass('current-song-track').text(currentSong.track);
        var currentSongArtist = $('<p>').addClass('current-song-artist').text(currentSong.artist);

        // Left Section Action
        var leftSection = $('#left-section');
        leftSection.append(songAlbumCover,progressBar, songButtonsWrapper, currentSongTrack, currentSongArtist, currentSongTrack, currentSongArtist)

        var audio = $('.audio-class').attr('src', currentSong.file)[0];

        playButton.click(function () {
            if (audio.paused) {
                audio.play();
                playButton.removeClass('far fa-play-circle');
                playButton.addClass('far fa-pause-circle');
            } else {
                audio.pause();
                playButton.removeClass('far fa-pause-circle');
                playButton.addClass('far fa-play-circle')
            }
        })

        // Progress Bar
        localStorage.setItem('currentSongId', 0)
        var aud = $('.audio-class')[0];
        setInterval (function () {
            var posMultiple=(500/(aud.duration)).toFixed();
            var posWidth=aud.currentTime.toFixed()*posMultiple+"px";
            console.log(posWidth)
            progressPos.css({
                'width':posWidth,            
            })
        },500)
    }

})