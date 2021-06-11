$(document).ready(() => {
    $.ajax({
        type: 'GET',
        url: '/api/settings',
        success: (res) => {
            console.log(res.filetypes);
            for (let [filetype, filecolor] of Object.entries(res.filetypes)) {
                document.documentElement.style.setProperty(`--${filetype}-color`, filecolor);
            }
        }
    });
});