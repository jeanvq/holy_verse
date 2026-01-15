#!/bin/bash

# Create simple PNG icons using ImageMagick if available, or create placeholder SVGs

# Try to create with ImageMagick
if command -v convert &> /dev/null; then
    convert -size 192x192 xc:#667eea \
            -pointsize 120 -fill white -gravity center \
            -annotate +0+0 '📖' \
            icon-192x192.png
    echo "✅ Created icon-192x192.png"
    
    convert -size 144x144 xc:#667eea \
            -pointsize 90 -fill white -gravity center \
            -annotate +0+0 '📖' \
            icon-144x144.png
    echo "✅ Created icon-144x144.png"
    
    convert -size 96x96 xc:#667eea \
            -pointsize 60 -fill white -gravity center \
            -annotate +0+0 '📖' \
            icon-96x96.png
    echo "✅ Created icon-96x96.png"
else
    echo "ImageMagick not available, creating SVG icons instead"
    
    # Create SVG icons as fallback
    cat > icon-192x192.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#667eea"/>
  <text x="96" y="130" font-size="100" fill="white" text-anchor="middle" font-family="Arial">📖</text>
</svg>
SVGEOF
    echo "✅ Created icon-192x192.svg"
fi
