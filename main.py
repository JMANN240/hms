import os, pathlib, json
from mimetypes import guess_type
from flask import Flask, send_file, request
from flask.templating import render_template

app = Flask(__name__)
mainPath = pathlib.Path(__file__).parent.absolute()

@app.route('/')
def index():
    files = [{"file": f, "filename": os.path.splitext(f)[0], "type": guess_type(f)[0].split('/')[0]} for f in os.listdir(os.path.join(mainPath, 'media')) if os.path.isfile(os.path.join(mainPath, 'media', f))]
    with open('settings.json') as settings_file:
        settings = json.load(settings_file)
    return render_template('index.html', files = files, settings = settings)

@app.route('/settings')
def settings():
    with open('settings.json') as settings_file:
        settings = json.load(settings_file)
    return render_template('settings.html', settings = settings)

@app.route('/media/<filename>')
def media(filename):
    as_attachment = request.args.get('as_attachment') == "true"
    return send_file(os.path.join(mainPath, 'media', filename), as_attachment=as_attachment)

@app.route('/api/settings', methods=['GET', 'POST'])
def api_settings():
    if request.method == 'GET':
        with open('settings.json') as settings_file:
            settings = json.load(settings_file)
            return settings

    if request.method == 'POST':
        with open('settings.json') as settings_file:
            settings = json.load(settings_file)
        settings['filetypes'] = request.form
        with open('settings.json', 'w') as settings_file:
            json.dump(settings, settings_file)
        return "200"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)