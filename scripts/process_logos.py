from PIL import Image
import numpy as np
import os

def process_logo(input_path, output_path):
    """Remove white background and convert dark pixels to white."""
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # Extract channels
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Make white/near-white pixels fully transparent (threshold 230)
    white_mask = (r > 230) & (g > 230) & (b > 230)
    data[white_mask] = [0, 0, 0, 0]

    # For non-transparent pixels, make them white
    visible_mask = data[:,:,3] > 0
    data[visible_mask, 0] = 255  # R
    data[visible_mask, 1] = 255  # G
    data[visible_mask, 2] = 255  # B
    # Keep alpha as-is for smooth edges

    result = Image.fromarray(data)
    result.save(output_path, "PNG")
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
