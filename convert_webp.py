import os
from PIL import Image

def convert_to_webp(folder):
    for filename in os.listdir(folder):
        if filename.endswith(".png") or filename.endswith(".jpg"):
            path = os.path.join(folder, filename)
            img = Image.open(path)
            webp_path = os.path.join(folder, filename.rsplit(".", 1)[0] + ".webp")
            img.save(webp_path, "WEBP", quality=80)
            print(f"Converted {filename} to {webp_path}")

convert_to_webp("img")
