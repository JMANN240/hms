function escapeURL(unsafe) {
    return unsafe
         .replace(/&/g, "%26")
}

var load_media = () => {
    $.ajax({
        type: 'GET',
        url: `/api/media?search=${$('#search').val()}`,
        success: (res) => {
            console.log(res.files);
            $('#media').empty();
            for (let file of res.files) {
                $('#media').append(`
                    <div class="card ${file.type}" style="flex-direction: column;">
                        ${file.thumbnail == null ? "" : `<img style="width: 20ch;" src="/media?filepath=${escapeURL(file.thumbnail)}&as_attachment=false"></img>`}
                        ${file.name}
                        <div style="width: 100%; margin: 1vw; display: flex; flex-direction: row; justify-content: space-around;">
                            <a href="/media?filepath=${escapeURL(file.path)}&as_attachment=false" class="btn">View</a>
                            <a href="/media?filepath=${escapeURL(file.path)}&as_attachment=true" class="btn">Download</a>
                            <input class="selection" type="checkbox" id="${file.path}">
                            <label for="${file.path}" class="${file.type}"></label>
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

$(document).on('input', '.selection', (e) => {
    var selected = $('.selection:checked');
    if (selected.length > 0) {
        $('#download-all').css('display', 'inline-block');
    } else {
        $('#download-all').css('display', 'none');
    }
    var files = [];
    for (var select of selected) {
        files.push(select.id);
    }
    $('#download-all').attr('href', `/massmedia?files=${JSON.stringify(files)}`);
})

/*$('#download-all').on('click', (e) => {
    var selected = $('.selection:checked');
    var files = [];
    for (var select of selected) {
        files.push(select.id);
    }
    console.log(files);
    $.ajax({
        type: 'POST',
        url: '/massmedia',
        contentType: 'application/json',
        data: JSON.stringify(
            {
                files: files
            }
        ),
        success: (res) => {
            var filename = 'files.zip';
            var blob = new Blob([res], {type: "application/x-zip-compressed"});
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        },
        failure: (res) => {
            console.log("fail");
        }
    });
})*/