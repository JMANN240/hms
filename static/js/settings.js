const audio_color = document.querySelector('#audio-color');
const video_color = document.querySelector('#video-color');
const image_color = document.querySelector('#image-color');
const text_color = document.querySelector('#text-color');

$(document).on('click', '#save-btn', (e) => {
    $.ajax({
        type: 'POST',
        url: '/api/settings',
        data: {audio: audio_color.value, video: video_color.value, image: image_color.value, text: text_color.value},
        mimeType: 'json',
        success: () => {
            $(e.target).addClass('good-flash');
            setTimeout(() => {
                $(e.target).removeClass('good-flash');
            }, 1000);
        },
        failure: () => {
            $(e.target).addClass('bad-flash');
            setTimeout(() => {
                $(e.target).removeClass('bad-flash');
            }, 1000);
        }
    });
});