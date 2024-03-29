import os, pathlib, json, time
from os.path import isfile, join, splitext
from mimetypes import guess_type
from flask import Flask, send_file, request, flash, redirect
from flask.templating import render_template
from werkzeug.utils import secure_filename
from zipfile import ZipFile

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/settings')
def settings():
    with open('settings.json') as settings_file:
        settings = json.load(settings_file)
    return render_template('settings.html', settings = settings)

@app.route('/media')
def media():
    filepath = request.args.get('filepath')
    as_attachment = request.args.get('as_attachment') == "true"
    return send_file(filepath, as_attachment=as_attachment)

@app.route('/massmedia')
def massmedia():
    files = json.loads(request.args.get('files'))
    print(files)
    for f in os.listdir('zips'):
        if (f != '.gitignore'):
            os.remove(join('zips', f))
    zipFilepath = f'zips/{round(time.time())}.zip'
    with ZipFile(zipFilepath, 'w') as zipObj:
        for file in files:
            zipObj.write(file)
    return send_file(zipFilepath, as_attachment=True)

@app.route('/api/media', methods=['GET', 'POST'])
def api_media():
    if request.method == 'GET':
        with open('settings.json') as settings_file:
            settings = json.load(settings_file)
        search = request.args.get('search')
        files = []
        for path in settings['search_paths']:
            pathfiles = os.listdir(path)
            for f in pathfiles:
                if isfile(join(path, f)) and search.lower() in f.lower():
                    file_path = join(path, f)
                    file_name = splitext(f)[0]
                    file_guess = guess_type(f, strict=False)[0]
                    file_type = file_guess.split('/')[0] if file_guess is not None else "unknown"
                    other_files = [other for other in pathfiles if splitext(other)[0] == file_name and other != f]
                    if file_type == "image":
                        if len(other_files) == 0:
                            files.append({"path": file_path, "name": file_name, "type": file_type, "thumbnail": file_path})
                    else:
                        if len(other_files) > 0:
                            files.append({"path": file_path, "name": file_name, "type": file_type, "thumbnail": join(path, other_files[0])})
                        else:
                            files.append({"path": file_path, "name": file_name, "type": file_type, "thumbnail": None})
        return {'files': files}
    
    if request.method == 'POST':
        with open('settings.json') as settings_file:
            settings = json.load(settings_file)

        file = request.files.get('file')
    
        if not file:
            print("No file part")
            flash("No file part")
            return redirect('/')
        
        if file.filename == '':
            print("No file selected")
            flash("No file selected")
            return redirect('/')
        
        filename = secure_filename(file.filename)
        file.save(join(settings['client_upload_path'], filename))
        return "200"

@app.route('/api/settings', methods=['GET', 'POST'])
def api_settings():
    if request.method == 'GET':
        with open('settings.json') as settings_file:
            settings = json.load(settings_file)
            return settings

    if request.method == 'POST':
        with open('settings.json') as settings_file:
            settings = json.load(settings_file)
        settings = request.json
        with open('settings.json', 'w') as settings_file:
            json.dump(settings, settings_file, indent=4, separators=(', ', ': '))
        return "200"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)