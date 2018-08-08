#!/usr/bin/env python

import time

from envirophat import leds


try:
    while True:
		leds.on()
		time.sleep(0.1)
		leds.off()
		time.sleep(0.1)

except KeyboardInterrupt:
    pass
