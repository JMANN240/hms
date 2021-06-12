import os, pathlib, json
from os.path import isfile, join, splitext
from mimetypes import guess_type
from flask import Flask, send_file, request
from flask.templating import render_template

app = Flask(__name__)

@app.route('/')
def index():
    with open('settings.json') as settings_file:
        settings = json.load(settings_file)
    files = []
    for path in settings['search_paths']:
        for f in os.listdir(path):
            if isfile(join(path, f)):
                file_path = join(path, f)
                file_name = splitext(f)[0]
                file_guess = guess_type(f)[0]
                file_type = file_guess.split('/')[0] if file_guess is not None else "unknown"
                files.append({"path": file_path, "name": file_name, "type": file_type})
    print(files)
    return render_template('index.html', files = files, settings = settings)

@app.route('/settings')
def settings():
    with open('settings.json') as settings_file:
        settings = json.load(settings_file)
    return render_template('settings.html', settings = settings)

@app.route('/file')
def file():
    filepath = request.args.get('filepath')
    as_attachment = request.args.get('as_attachment') == "true"
    return send_file(filepath, as_attachment=as_attachment)

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
            json.dump(settings, settings_file, indent=4, separators=(', ', ': '))
        return "200"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)