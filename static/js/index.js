var load_media = (search) => {
    $.ajax({
        type: 'GET',
        url: `/api/media?search=${search}`,
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
    load_media('');
});

$('#search').on("input", (e) => {
    load_media(e.target.value);
});