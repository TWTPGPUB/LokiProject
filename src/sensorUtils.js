module.exports = {

 //  lcd: { var lcd_ln1, var lcd_ln2, var cursor_ln1, var cursor_ln2},
//======================["public" functions]=============

	lcd_writeMessage: function(lcd, msg, line_num, scroll, color){
		
		lcd.setCursor(line_num, 0);
		lcd.write(msg);
		lcd.scroll(scroll);
		//Set the color
		var r = color.charAt(0)+color.charAt(1);
		r = parseInt(r, 16);

		var g = color.charAt(2)+color.charAt(3);
		g = parseInt(g, 16);

		var b = color.charAt(4)+color.charAt(6);
		b = parseInt(b, 16);
		lcd.setColor(r, g, b);
		
	},

	
	lght_getLevel: function(pin){
		var upm=require('jsupm_grove');
		var light=new upm.GroveLight(pin);
		
		return light.value();
	},

//==========================[EXPERIMENTAL]===============
	read_AmbientTemperature: function(pinNumber, inFarenheit) {
		var UPM = require('jsupm_grove');
		var sensor = new UPM.GroveTemp(pinNumber);
		var temp=sensor.value()+60;
		
		if(inFarenheit==true){
			temp = temp*(5/9)+32;
			Math.round(temp);
			}
		
		return temp;
	}
/*	
	read_AmbientHumidity: function(){
		var groveSensor = require('jsupm_th02');
		console.log("THO2: "+typeof(groveSensor.TH02));
		var th_sensor = new groveSensor.TH02();
		
	    console.log("Status "+th_sensor.getStatus());
		
		var value=th_sensor.getHumidity();
		console.log("Current Humidity Reading: "+value);
		return value;
	}
	*/
	


}