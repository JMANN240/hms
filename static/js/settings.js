const audio_color = document.querySelector('#audio-color');
const video_color = document.querySelector('#video-color');
const image_color = document.querySelector('#image-color');
const text_color = document.querySelector('#text-color');
const search_paths = document.querySelector('#search-paths');
const client_upload_path = document.querySelector('#client-upload-path');

$(document).on('click', '#save-btn', (e) => {
    console.log(JSON.stringify(search_paths.value.slice(1, -1).split(',').map(x => x.trim().slice(1, -1))));
    $.ajax({
        type: 'POST',
        url: '/api/settings',
        contentType: 'application/json',
        dataType : 'json',
        data: JSON.stringify({
            filetypes: {
                audio: audio_color.value, 
                video: video_color.value, 
                image: image_color.value, 
                text: text_color.value
            },
            search_paths: search_paths.value.slice(1, -1).split(',').map(x => x.trim().slice(1, -1)),
            client_upload_path: client_upload_path.value
        }),
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