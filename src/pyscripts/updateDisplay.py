
import sys
import Adafruit_GPIO.SPI as SPI
import Adafruit_SSD1306
import subprocess

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

print "This is the name of the script: ", sys.argv[0]
print "Number of arguments: ", len(sys.argv)
print "The arguments are: " , str(sys.argv)

# Raspberry Pi pin configuration:
RST = None     # on the PiOLED this pin isnt used
# Note the following are only used with SPI:
DC = 23
SPI_PORT = 0
SPI_DEVICE = 0


# 128x32 display with hardware I2C:
disp = Adafruit_SSD1306.SSD1306_128_32(rst=RST)


# Initialize library.
disp.begin()

# Create blank image for drawing.
# Make sure to create image with mode '1' for 1-bit color.
width = disp.width
height = disp.height
image = Image.new('1', (width, height))

# Get drawing object to draw on image.
draw = ImageDraw.Draw(image)

# Draw some shapes.
# First define some constants to allow easy resizing of shapes.
padding = -2
top = padding
bottom = height-padding
# Move left to right keeping track of the current x position for drawing shapes.
x = 0

# Load default font.
font = ImageFont.load_default()

cmd = "hostname -I | cut -d\' \' -f1"
IP = subprocess.check_output(cmd, shell = True )
draw.text((x, top),       "IP: " + str(IP),  font=font, fill=255)


if(len(sys.argv) >1):
	draw.text((x, top+8),     str(sys.argv[1]), font=font, fill=255)
if(len(sys.argv) >2):
	draw.text((x, top+16),    str(sys.argv[2]),  font=font, fill=255)
if(len(sys.argv) >3):
		draw.text((x, top+25),    str(sys.argv[3]),  font=font, fill=255)

# Display image.
disp.image(image)
disp.display()