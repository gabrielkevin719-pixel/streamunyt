from PIL import Image
import os

def process_logo(input_path, output_path):
    """Remove white background and convert dark pixels to white."""
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            # Make white/near-white pixels fully transparent
            if r > 230 and g > 230 and b > 230:
                pixels[x, y] = (0, 0, 0, 0)
            elif a > 0:
                # For visible non-white pixels, make them white (keep alpha for smooth edges)
                pixels[x, y] = (255, 255, 255, a)

    img.save(output_path, "PNG")
    print(f"Processed: {input_path} -> {output_path}")

logos_dir = os.path.join(os.path.dirname(__file__), "..", "public", "logos")

process_logo(
    os.path.join(logos_dir, "hbo-max.png"),
    os.path.join(logos_dir, "hbo-max-processed.png"),
)

process_logo(
    os.path.join(logos_dir, "disney-plus.png"),
    os.path.join(logos_dir, "disney-plus-processed.png"),
)
