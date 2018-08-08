#!/usr/bin/env python

import sys
import time

from envirophat import light, weather, motion, analog

def write(line):
    sys.stdout.write(line)
    sys.stdout.flush()

unit = 'hPa' # Pressure unit, can be either hPa (hectopascals) or Pa (pascals)

rgb = light.rgb()
analog_values = analog.read_all()
mag_values = motion.magnetometer()
acc_values = [round(x,2) for x in motion.accelerometer()]

output = """
{{ \"Environment\": {{ \"Temperature\": {t:.2f}, \"TUnits\": \"C\", \"Pressure\": {p:.2f}, \"PUnits\": \"{unit}\", \"Light\": {c} }},
\"Color\": {{ \"R\": {r}, \"G\":{g}, \"B\":{b} }}, 
\"Motion\": {{ \"Heading": {h},\"Magnetometer\": {{ \"X\": {mx}, \"Y\":{my}, \"Z\":{mz} }}, \"Accelerometer\": {{ \"X\": {ax}, \"Y\":{ay}, \"Z\":{az} }}}},
\"Analog\": {{ \"A0\": {a0}, \"A1\": {a1}, \"A2\":{a2}, \"A3\":{a3}}}
}}
""".format(
        unit = unit,
        a = weather.altitude(), # Supply your local qnh for more accurate readings
        t = weather.temperature(),
        p = weather.pressure(unit=unit),
        c = light.light(),
        r = rgb[0],
        g = rgb[1],
        b = rgb[2],
        h = motion.heading(),
        a0 = analog_values[0],
        a1 = analog_values[1],
        a2 = analog_values[2],
        a3 = analog_values[3],
        mx = mag_values[0],
        my = mag_values[1],
        mz = mag_values[2],
        ax = acc_values[0],
        ay = acc_values[1],
        az = acc_values[2]
    )
	
write(output)