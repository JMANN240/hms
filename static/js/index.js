var load_media = () => {
    $.ajax({
        type: 'GET',
        url: `/api/media?search=${$('#search').val()}`,
        success: (res) => {
            $('#media').empty();
            for (let file of res.files) {
                $('#media').append(`
                    <div class="card ${file.type}" style="flex-direction: column;">
                        ${file.name}
                        <div style="width: 100%; margin: 1vw; display: flex; flex-direction: row; justify-content: space-around;">
                            <a href="/media?filepath=${file.path}&as_attachment=false" class="btn">View</a>
                            <a href="/media?filepath=${file.path}&as_attachment=true" class="btn">Download</a>
                        </div>
                    </div>
                `);
                
            }
        }
    });
}

$(document).ready(() => {
    $.ajax({
        type: 'GET',
        url: '/api/settings',
        success: (res) => {
            for (let [filetype, filecolor] of Object.entries(res.filetypes)) {
                document.documentElement.style.setProperty(`--${filetype}-color`, filecolor);
            }
        }
    });
    load_media();
});

$('#search').on("input", (e) => {
    load_media();
});

$('#new-file').on('change', (e) => {
    var fd = new FormData();
    console.log(fd);
    var files = $('#new-file')[0].files;
    if (files.length > 0) {
        fd.append('file',files[0]);
        $.ajax({
            type: 'POST',
            url: '/api/media',
            data: fd,
            processData: false,
            contentType: false,
            success: () => {
                $('label[for="new-file"]').addClass('good-flash');
                setTimeout(() => {
                    $('label[for="new-file"]').removeClass('good-flash');
                }, 1000);
                load_media();
            },
            failure: () => {
                $('label[for="new-file"]').addClass('bad-flash');
                setTimeout(() => {
                    $('label[for="new-file"]').removeClass('bad-flash');
                }, 1000);
            }
        });
    }
});