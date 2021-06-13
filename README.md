# HMS: Home Media Server

This is a minimalist home media server powered by flask that can be used to share media or other files between computers on the same network. Currenly supports coloring audio, video, image, and text files. Other files will work, but will be given a default shadow color.

---

## Usage

1. Install dependencies listed in requirements.txt. Usually this can be done with `python3 -m pip install -r requirements.txt` but may be different depending on your environment.
2. Put the media you want to serve in the media directory. This is where client uploads go by default.
3. You can alter settings.json to include more paths to search and to change where client uploads go.
4. Run main.py with your python interpreter. This was developed with Python 3.8.0 but should work with others.
5. Connect to the serving computer using its IP address on port 8000.