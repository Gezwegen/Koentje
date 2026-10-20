from PIL import Image
import os

def make_transparent(file_name):
    # Open Image
    img = Image.open(f"img/{file_name}.jpg")
    img = img.convert("RGBA")

    # Get data
    datas = img.getdata()
    newData = []

    # Replace near-white with transparent
    for item in datas:
        # If RGB values are high (close to white)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(f"img/{file_name}.png", "PNG")
    print(f"Saved img/{file_name}.png")

make_transparent("mac")
make_transparent("late")
make_transparent("ai")
