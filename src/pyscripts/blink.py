#!/usr/bin/env python

import time

from envirophat import leds

limit = 50

try:
    while limit > 0:
		leds.on()
		time.sleep(0.1)
		leds.off()
		time.sleep(0.1)
		limit=limit-1

except KeyboardInterrupt:
    pass
