#!/usr/bin/env python

from envirophat import weather, leds

temperature = weather.temperature()

print("{{\"temperature\":{0}, \"unit\"=\"C\"}}".format(temperature))