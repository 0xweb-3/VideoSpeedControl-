#!/usr/bin/env python3
"""
Simple PNG icon generator for VideoSpeedControl Chrome Extension
Creates basic PNG icons with play button and speed indicators
"""

import struct
import zlib
import os

def create_png(width, height, pixels):
    """Create a PNG file from pixel data"""
    
    def crc32(data):
        """Calculate CRC32 checksum"""
        return zlib.crc32(data) & 0xffffffff
    
    def write_chunk(chunk_type, data):
        """Write a PNG chunk"""
        return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', crc32(chunk_type + data))
    
    # PNG signature
    png_data = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)  # 8-bit RGBA
    png_data += write_chunk(b'IHDR', ihdr)
    
    # IDAT chunk
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # Filter type
        for x in range(width):
            if y < len(pixels) and x < len(pixels[y]):
                r, g, b, a = pixels[y][x]
            else:
                r, g, b, a = 255, 255, 255, 0  # Transparent white
            raw_data += struct.pack('BBBB', r, g, b, a)
    
    compressed_data = zlib.compress(raw_data)
    png_data += write_chunk(b'IDAT', compressed_data)
    
    # IEND chunk
    png_data += write_chunk(b'IEND', b'')
    
    return png_data

def create_icon_pixels(size):
    """Create pixel data for the VideoSpeedControl icon"""
    pixels = []
    center = size // 2
    
    for y in range(size):
        row = []
        for x in range(size):
            # Calculate distance from center
            dx = x - center
            dy = y - center
            distance = (dx*dx + dy*dy) ** 0.5
            
            # Circle radius
            radius = size * 0.44
            
            if distance <= radius:
                # Inside circle - gradient background
                gradient_factor = distance / radius
                if gradient_factor < 0.7:
                    # Inner gradient (lighter purple to darker purple)
                    r = int(102 + (118-102) * gradient_factor)  # 667eea -> 764ba2
                    g = int(126 + (75-126) * gradient_factor)
                    b = int(234 + (162-234) * gradient_factor)
                else:
                    # Outer edge - darker
                    r, g, b = 118, 75, 162
                
                # Play triangle
                if (abs(dx) < size * 0.25 and abs(dy) < size * 0.25):
                    # Triangle area
                    if dx > -size * 0.15 and dx < size * 0.2:
                        # Triangle shape: wider on left, point on right
                        triangle_width = size * 0.3 - abs(dy) * 0.8
                        if dx < triangle_width * 0.5:
                            r, g, b = 255, 255, 255  # White play button
                
                # Speed lines for larger icons
                if size >= 32:
                    line_x = size * 0.7
                    line_y1 = size * 0.3
                    line_y2 = size * 0.4
                    line_y3 = size * 0.5
                    
                    if (x >= line_x and x <= line_x + size * 0.15):
                        if (abs(y - line_y1) < 2 or abs(y - line_y2) < 2 or abs(y - line_y3) < 2):
                            r, g, b = 255, 107, 53  # Orange speed lines
                
                row.append((r, g, b, 255))  # Opaque
                
            elif distance <= radius + 2:
                # Border
                row.append((90, 103, 216, 255))  # Blue border
            else:
                # Outside - transparent
                row.append((255, 255, 255, 0))
        
        pixels.append(row)
    
    return pixels

def main():
    """Generate all required icon sizes"""
    sizes = [16, 32, 48, 128]
    
    # Create icons directory if it doesn't exist
    os.makedirs('assets/icons', exist_ok=True)
    
    for size in sizes:
        print(f"Generating {size}x{size} icon...")
        
        try:
            pixels = create_icon_pixels(size)
            png_data = create_png(size, size, pixels)
            
            output_path = f'assets/icons/icon{size}.png'
            with open(output_path, 'wb') as f:
                f.write(png_data)
            
            print(f"✅ Created: {output_path}")
            
        except Exception as e:
            print(f"❌ Error creating {size}x{size} icon: {e}")
    
    print("\nIcon generation complete!")

if __name__ == "__main__":
    main()