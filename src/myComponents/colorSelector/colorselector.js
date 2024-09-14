import {NearestHTMLColorName,CSGLSquare,CSGLBar,CSGLSquareDragger,CSGLBarDragger} from './lib.js'
export class ColorSelector {
  constructor() {
    var self = this;
    this.rgb = {r:255,g:255,b:255};
    this.hsb = {h:0,s:0,b:100};
    this.lab = {l:100,a:0,b:0};
    this.cmyk = {c:0,m:0,y:0,k:0};
    this.Palette = 0;
    this.Channel = parseInt($('input[name=channel]:checked').val(), 10);
    this.NearestHN = new NearestHTMLColorName();
    this.Circle = $('#cssquarecursor circle');
    this.inRGB_R = $('#inRGB_R');
    this.inRGB_G = $('#inRGB_G');
    this.inRGB_B = $('#inRGB_B');
    this.inHSB_H = $('#inHSB_H');
    this.inHSB_S = $('#inHSB_S');
    this.inHSB_B = $('#inHSB_B');
    this.inLab_L = $('#inLab_L');
    this.inLab_a = $('#inLab_a');
    this.inLab_b = $('#inLab_b');
    this.inCMYK_C = $('#inCMYK_C');
    this.inCMYK_M = $('#inCMYK_M');
    this.inCMYK_Y = $('#inCMYK_Y');
    this.inCMYK_K = $('#inCMYK_K');
    this.inHEX = $('#inHEX');
    this.outHTML = $('#outHTML');
    this.selColor = $('#cscolor');
    this.selHTMLColor = $('#cshtmlcolor');
    this.Square = new CSGLSquare($('#cssquare').get(0));
    this.Bar = new CSGLBar($('#csbar').get(0));
    let x,y,Y;
    if(this.Channel==3||this.Channel==4||this.Channel==5){
      let h = this.hsb.h, s = this.hsb.s, b = this.hsb.b;
      if(this.Channel==3){
        x=s/100*255,y=255-b/100*255,Y=h/360*255;
      }else if(this.Channel==4){
        x=h/360*255,y=255-b/100*255,Y=s/100*255;
      }else if(this.Channel==5){
        x=h/360*255,y=255-s/100*255,Y=b/100*255;
      }
    }else if(this.Channel==6||this.Channel==7||this.Channel==8){
      let l = this.lab.l, a = this.lab.a, b = this.lab.b;
      if(this.Channel==6){
        x=a+128,y=255-(b+128),Y=l/100*255;
      }else if(this.Channel==7){
        x=b+128,y=255-l/100*255,Y=a+128;
      }else if(this.Channel==8){
        x=a+128,y=255-l/100*255,Y=b+128;
      }
    }else if(this.Channel==0||this.Channel==1||this.Channel==2){
      let r = this.rgb.r, g = this.rgb.g, b = this.rgb.b;
      if(this.Channel==0){
        x=b,y=255-g,Y=r;
      }else if(this.Channel==1){
        x=b,y=255-r, Y=g;
      }else if(this.Channel==2){
        x=r,y=255-g,Y=b;
      }
    }

    this.SquareDragger = new CSGLSquareDragger('#cssquarecursor',x,y, function (x,y) {self.squareDraggerChanged(x,y);});
    this.BarDragger = new CSGLBarDragger('#csbarcursor',255-Y, function (y) {self.barDraggerChanged(y);});

    $('input[name=channel]').on('click', function () {
      self.Channel = parseInt($('input[name=channel]:checked').val(), 10);
      // self.Square.update(self.Channel, self.BarDragger.val()/255, self.Palette);
      // self.Bar.update(self.Channel, [self.SquareDragger.valX()/255, self.SquareDragger.valY()/255], self.Palette);
      self.channelChanged();
    });
    // $('input[name=cspalette]').on('click', function () {
    //   self.Palette = parseInt($('input[name=cspalette]:checked').val(), 10);
    //   self.setRgb(self.rgb.r, self.rgb.g, self.rgb.b);
    //   self.Square.update(self.Channel, self.BarDragger.val()/255, self.Palette);
    //   self.Bar.update(self.Channel, [self.SquareDragger.valX()/255, self.SquareDragger.valY()/255], self.Palette);
    //   self.update();
    // });
    $('input[name=cspalette1]').on('click', function () {
      self.Palette = this.checked?1:0;
      self.setRgb(self.rgb.r, self.rgb.g, self.rgb.b);
      self.Square.update(self.Channel, self.BarDragger.val()/255, self.Palette);
      self.Bar.update(self.Channel, [self.SquareDragger.valX()/255, self.SquareDragger.valY()/255], self.Palette);
      self.update();
    });
    $('#inHEX').on('change',()=>{
      let rgb = self.hexToRgb($('#inHEX').val())
      self.setRgb(rgb.r,rgb.g,rgb.b)
      self.update()
      self.channelChanged();
    })
    let funcHSB = ()=>{
      let H = Number($('#inHSB_H').val())
      let S = Number($('#inHSB_S').val())
      let B = Number($('#inHSB_B').val())
      // let rgb = convert.hsv.rgb(H,S,B)
      self.setRgbFromHsb(H/360.0,S/100,B/100)
      self.update()
      self.channelChanged();
    }
    $('#inHSB_H').on('change',funcHSB)
    $('#inHSB_S').on('change',funcHSB)
    $('#inHSB_B').on('change',funcHSB)
    let funcRGB = ()=>{
      let r = Number($('#inRGB_R').val())
      let g = Number($('#inRGB_G').val())
      let b = Number($('#inRGB_B').val())
      self.setRgb(r,g,b)
      self.update()
      self.channelChanged();
    }
    $('#inRGB_R').on('change',funcRGB)
    $('#inRGB_G').on('change',funcRGB)
    $('#inRGB_B').on('change',funcRGB)
    let funcLab = ()=>{
      let L = Number($('#inLab_L').val())
      let a = Number($('#inLab_a').val())
      let b = Number($('#inLab_b').val())

      self.setRgbFromLab(L,a,b)
      self.update()
      self.channelChanged();
    }
    $('#inLab_L').on('change',funcLab)
    $('#inLab_a').on('change',funcLab)
    $('#inLab_b').on('change',funcLab)

    // this.Channel=3
    // this.hsb = {h:240+60,s:100,b:100};
    // self.channelChanged()
  }
  channelChanged() {
    //console.log('!!!!!!!!!!!!!!channelChanged');
    if (this.BarDragger || this.SquareDragger) {
      switch (this.Channel) {
        case 0:
          var r = this.rgb.r, g = this.rgb.g, b = this.rgb.b;
          this.SquareDragger.update(b, 255-g);
          this.BarDragger.update(r);
          break;
        case 1:
          var r = this.rgb.r, g = this.rgb.g, b = this.rgb.b;
          this.SquareDragger.update(b, 255-r);
          this.BarDragger.update(g);
          break;
        case 2:
          var r = this.rgb.r, g = this.rgb.g, b = this.rgb.b;
          this.SquareDragger.update(r, 255-g);
          this.BarDragger.update(b);
          break;
        case 3:
          var h = this.hsb.h, s = this.hsb.s, b = this.hsb.b;
          this.SquareDragger.update(s/100*255, 255-b/100*255);
          this.BarDragger.update(h/360*255);
          break;
        case 4:
          var h = this.hsb.h, s = this.hsb.s, b = this.hsb.b;
          this.SquareDragger.update(h/360*255, 255-b/100*255);
          this.BarDragger.update(s/100*255);
          break;
        case 5:
          var h = this.hsb.h, s = this.hsb.s, b = this.hsb.b;
          this.SquareDragger.update(h/360*255, 255-s/100*255);
          this.BarDragger.update(b/100*255);
          break;
        case 6:
          var l = this.lab.l, a = this.lab.a, b = this.lab.b;
          this.SquareDragger.update(a+128, 255-(b+128));
          this.BarDragger.update(l/100*255);
          break;
        case 7:
          var l = this.lab.l, a = this.lab.a, b = this.lab.b;
          this.SquareDragger.update(b+128, 255-l/100*255);
          this.BarDragger.update(a+128);
          break;
        case 8:
          var l = this.lab.l, a = this.lab.a, b = this.lab.b;
          this.SquareDragger.update(a+128, 255-l/100*255);
          this.BarDragger.update(b+128);
          break;
      }
    }
  }
  barDraggerChanged(y) {
    //console.log('barDraggerChanged');
    this.Square.update(this.Channel, parseFloat(y / 255), this.Palette);
    if (this.SquareDragger) {
      switch (this.Channel) {
        case 0:
          this.setRgb(y, this.rgb.g, this.rgb.b);
          break;
        case 1:
          this.setRgb(this.rgb.r, y, this.rgb.b);
          break;
        case 2:
          this.setRgb(this.rgb.r, this.rgb.g, y);
          break;
        case 3:
          this.setRgbFromHsb(y/255, this.SquareDragger.valX()/255, 1-this.SquareDragger.valY()/255);
          break;
        case 4:
          this.setRgbFromHsb(this.SquareDragger.valX()/255, y/255, 1-this.SquareDragger.valY()/255);
          break;
        case 5:
          this.setRgbFromHsb(this.SquareDragger.valX()/255, 1-this.SquareDragger.valY()/255, y/255);
          break;
        case 6:
          this.setRgbFromLab(y*20/51, this.SquareDragger.valX()-128, 127-this.SquareDragger.valY());
          break;
        case 7:
          this.setRgbFromLab(100-this.SquareDragger.valY()*20/51, y-128, this.SquareDragger.valX()-128);
          break;
        case 8:
          this.setRgbFromLab(100-this.SquareDragger.valY()*20/51, this.SquareDragger.valX()-128, y-128);
          break;
      }
    }
    this.update();
    this.updateCircle();
  }
  squareDraggerChanged(x, y) {
    //console.log('squareDraggerChanged');
    this.Bar.update(this.Channel, [x/255,y/255], this.Palette);
    if (this.BarDragger) {
      switch (this.Channel) {
        case 0:
          this.setRgb(this.rgb.r, 255-y, x);
          break;
        case 1:
          this.setRgb(255-y, this.rgb.g, x);
          break;
        case 2:
          this.setRgb(x, 255-y, this.rgb.b);
          break;
        case 3:
          this.setRgbFromHsb(this.BarDragger.val()/255, x/255, 1-y/255);
          break;
        case 4:
          this.setRgbFromHsb(x/255, this.BarDragger.val()/255, 1-y/255);
          break;
        case 5:
          this.setRgbFromHsb(x/255, 1-y/255, this.BarDragger.val()/255);
          break;
        case 6:
          this.setRgbFromLab(this.BarDragger.val()*20/51, x-128, 127-y);
          break;
        case 7:
          this.setRgbFromLab(100-y*20/51, this.BarDragger.val()-128, x-128);
          break;
        case 8:
          this.setRgbFromLab(100-y*20/51, x-128, this.BarDragger.val()-128);
          break;
      }
    }
    this.update();
    this.updateCircle();
  }
  toWeb(v) {
    return Math.round(v/255*5)*51;
  }
  updateCircle() {
    if (this.rgb.r * 0.2126 + this.rgb.g * 0.7152 + this.rgb.b * 0.0722 > 127) this.Circle.attr('stroke', 'black');
    else this.Circle.attr('stroke', 'white');
    this.Circle.attr('fill', '#'+this.rgbToHex(this.rgb));
  }
  update() {
    this.hsb = this.rgbToHsb(this.rgb);
    this.lab = this.rgbToLab(this.rgb);
    this.cmyk = this.rgbToCmyk(this.rgb);
    this.updateInputs();
  }
  updateInputs() {
    console.log('updateInputs');
    //console.log(this.rgb);
    this.inRGB_R.val(Math.round(this.rgb.r));
    this.inRGB_G.val(Math.round(this.rgb.g));
    this.inRGB_B.val(Math.round(this.rgb.b));
    //console.log(this.hsb);
    this.inHSB_H.val(Math.round(this.hsb.h));
    this.inHSB_S.val(Math.round(this.hsb.s));
    this.inHSB_B.val(Math.round(this.hsb.b));
    //console.log(this.lab);
    this.inLab_L.val(Math.round(this.lab.l));
    this.inLab_a.val(Math.round(this.lab.a));
    this.inLab_b.val(Math.round(this.lab.b));
    //console.log(this.cmyk);
    this.inCMYK_C.val(Math.round(this.cmyk.c));
    this.inCMYK_M.val(Math.round(this.cmyk.m));
    this.inCMYK_Y.val(Math.round(this.cmyk.y));
    this.inCMYK_K.val(Math.round(this.cmyk.k));
    var hex = this.rgbToHex(this.rgb);
    this.inHEX.val(hex);
    this.selColor.css('background-color', '#'+hex);
    if (this.Palette != 2) {
      var html = this.NearestHN.find(this.rgb.r, this.rgb.g, this.rgb.b);
      this.outHTML.val(html.name);
      this.selHTMLColor.css('background-color', '#'+html.hex);
    } else {
      var html = this.NearestHN.get(this.rgb.r, this.rgb.g, this.rgb.b);
      if (html !== false) {
        this.outHTML.val(html.name);
        this.selHTMLColor.css('background-color', '#'+html.hex);
      }
    }
  }
  setRgb(r, g, b) {
    if (this.Palette == 1) {
      r = this.toWeb(r);
      g = this.toWeb(g);
      b = this.toWeb(b);
    } else if (this.Palette == 2) {
      var html = this.NearestHN.find(r, g, b);
      r = html.r;
      g = html.g;
      b = html.b;
    }
    this.rgb = {r:r,g:g,b:b};
  }
  setRgbFromHsb(h, s, b) {
    /*h = h*360;
    if (h == 360) h = 0;
    s = s*100;
    b = b*100;*/
    var rgb = this.hsbToRgb(h, s, b);
    if (this.Palette == 1) {
      rgb.r = this.toWeb(rgb.r);
      rgb.g = this.toWeb(rgb.g);
      rgb.b = this.toWeb(rgb.b);
    } else if (this.Palette == 2) {
      var html = this.NearestHN.find(rgb.r, rgb.g, rgb.b);
      rgb.r = html.r;
      rgb.g = html.g;
      rgb.b = html.b;
    }
    this.rgb = rgb;
  }
  setRgbFromLab(l, a, b) {
    /*this.lab.l = l;
    this.lab.a = a;
    this.lab.b = b;*/
    var rgb = this.labToRgb(l, a, b);
    if (this.Palette == 1) {
      rgb.r = this.toWeb(rgb.r);
      rgb.g = this.toWeb(rgb.g);
      rgb.b = this.toWeb(rgb.b);
    } else if (this.Palette == 2) {
      var html = this.NearestHN.find(rgb.r, rgb.g, rgb.b);
      rgb.r = html.r;
      rgb.g = html.g;
      rgb.b = html.b;
    }
    this.rgb = rgb;
  }
  rgbToHsb(rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    var _max = Math.max(r, Math.max(g, b)), _min = Math.min(r, Math.min(g, b));
    var h, s, v = _max;
    var d = _max - _min;
    s = _max == 0.0 ? 0.0 : d / _max;
    if (_max == _min) h = 0.0;
    else {
      switch (_max) {
        case r: h = (g - b) / d + (g < b ? 6.0 : 0.0); break;
        case g: h = (b - r) / d + 2.0; break;
        case b: h = (r - g) / d + 4.0; break;
      }
      h /= 6.0;
    }
    return {h:h*360, s:s*100, b:v*100};
  }
  hsbToRgb(h, s, v) {
    var r, g, b;
    var i = Math.floor(h * 6.0);
    var f = h * 6.0 - i;
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return {r:r*255, g:g*255, b:b*255};
  }
  labToRgb(l, a, _b) {
    var y = (l + 16) / 116,
      x = a / 500 + y,
      z = y - _b / 200,
      r, g, b;
    x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
    y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
    z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);
    r = x *  3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y *  1.8758 + z *  0.0415;
    b = x *  0.0557 + y * -0.2040 + z *  1.0570;
    r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
    g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
    b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;
    return {r:Math.max(0, Math.min(1, r)) * 255, g:Math.max(0, Math.min(1, g)) * 255, b:Math.max(0, Math.min(1, b)) * 255};
  }
  rgbToLab(rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    var x, y, z;
    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
    return {l:(116 * y) - 16, a:500 * (x - y), b:200 * (y - z)};
  }
  /*
  PostScript Language Reference Manual 2nd edition p. 305
  */
	cmykToRgb(cmyk) {
		var c = cmyk.c / 100;
		var m = cmyk.m / 100;
		var y = cmyk.y / 100;
		var k = cmyk.k / 100;
		var r = 1 - Math.min( 1, c * ( 1 - k ) + k );
		var g = 1 - Math.min( 1, m * ( 1 - k ) + k );
		var b = 1 - Math.min( 1, y * ( 1 - k ) + k );
		return {r:r * 255, g:g * 255, b:b * 255};
	}
  /*
  PostScript Language Reference Manual 2nd edition p. 305
  */
	rgbToCmyk(rgb) {
		var r = rgb.r / 255;
		var g = rgb.g / 255;
		var b = rgb.b / 255;
		var k = Math.min( 1 - r, 1 - g, 1 - b );
      var c = 0, m = 0, y = 0;
      if (k != 1) {
      c = ( 1 - r - k ) / ( 1 - k );
      m = ( 1 - g - k ) / ( 1 - k );
      y = ( 1 - b - k ) / ( 1 - k );
      }
		return {c:c*100, m:m*100, y:y*100, k:k*100};
	}
  rgbToHex(rgb) {
    var r = Math.round(rgb.r).toString(16);
    var g = Math.round(rgb.g).toString(16);
    var b = Math.round(rgb.b).toString(16);
    if (r.length < 2) r = '0'+r;
    if (g.length < 2) g = '0'+g;
    if (b.length < 2) b = '0'+b; 
    return r+g+b;
  }
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r:parseInt(result[1], 16),
      g:parseInt(result[2], 16),
      b:parseInt(result[3], 16)
    } : {r:0,g:0,b:0};
  }
}