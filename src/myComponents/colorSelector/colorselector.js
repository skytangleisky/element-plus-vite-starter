import squareVert from './shaders/square.vert.glsl?raw'
import squareFrag from './shaders/square.frag.glsl?raw'
import barVert from './shaders/bar.vert.glsl?raw'
import barFrag from './shaders/bar.frag.glsl?raw'
class NearestHTMLColorName {
  constructor() {
    this.Colors = [{name:'midnightblue',hex:'191970',r:25,g:25,b:112},{name:'dimgray',hex:'696969',r:105,g:105,b:105},{name:'slategray',hex:'708090',r:112,g:128,b:144},{name:'lightslategray',hex:'778899',r:119,g:136,b:153},{name:'maroon',hex:'800000',r:128,g:0,b:0},{name:'purple',hex:'800080',r:128,g:0,b:128},{name:'olive',hex:'808000',r:128,g:128,b:0},{name:'gray',hex:'808080',r:128,g:128,b:128},{name:'indianred',hex:'cd5c5c',r:205,g:92,b:92},{name:'lightcoral',hex:'f08080',r:240,g:128,b:128},{name:'salmon',hex:'fa8072',r:250,g:128,b:114},{name:'darksalmon',hex:'e9967a',r:233,g:150,b:122},{name:'lightsalmon',hex:'ffa07a',r:255,g:160,b:122},{name:'crimson',hex:'dc143c',r:220,g:20,b:60},{name:'red',hex:'ff0000',r:255,g:0,b:0},{name:'firebrick',hex:'b22222',r:178,g:34,b:34},{name:'darkred',hex:'8b0000',r:139,g:0,b:0},{name:'pink',hex:'ffc0cb',r:255,g:192,b:203},{name:'lightpink',hex:'ffb6c1',r:255,g:182,b:193},{name:'hotpink',hex:'ff69b4',r:255,g:105,b:180},{name:'deeppink',hex:'ff1493',r:255,g:20,b:147},{name:'mediumvioletred',hex:'c71585',r:199,g:21,b:133},{name:'palevioletred',hex:'db7093',r:219,g:112,b:147},{name:'coral',hex:'ff7f50',r:255,g:127,b:80},{name:'tomato',hex:'ff6347',r:255,g:99,b:71},{name:'orangered',hex:'ff4500',r:255,g:69,b:0},{name:'darkorange',hex:'ff8c00',r:255,g:140,b:0},{name:'orange',hex:'ffa500',r:255,g:165,b:0},{name:'gold',hex:'ffd700',r:255,g:215,b:0},{name:'yellow',hex:'ffff00',r:255,g:255,b:0},{name:'lightyellow',hex:'ffffe0',r:255,g:255,b:224},{name:'lemonchiffon',hex:'fffacd',r:255,g:250,b:205},{name:'lightgoldenrodyellow',hex:'fafad2',r:250,g:250,b:210},{name:'papayawhip',hex:'ffefd5',r:255,g:239,b:213},{name:'moccasin',hex:'ffe4b5',r:255,g:228,b:181},{name:'peachpuff',hex:'ffdab9',r:255,g:218,b:185},{name:'palegoldenrod',hex:'eee8aa',r:238,g:232,b:170},{name:'khaki',hex:'f0e68c',r:240,g:230,b:140},{name:'darkkhaki',hex:'bdb76b',r:189,g:183,b:107},{name:'lavender',hex:'e6e6fa',r:230,g:230,b:250},{name:'thistle',hex:'d8bfd8',r:216,g:191,b:216},{name:'plum',hex:'dda0dd',r:221,g:160,b:221},{name:'violet',hex:'ee82ee',r:238,g:130,b:238},{name:'orchid',hex:'da70d6',r:218,g:112,b:214},{name:'magenta',hex:'ff00ff',r:255,g:0,b:255},{name:'mediumorchid',hex:'ba55d3',r:186,g:85,b:211},{name:'mediumpurple',hex:'9370db',r:147,g:112,b:219},{name:'blueviolet',hex:'8a2be2',r:138,g:43,b:226},{name:'darkviolet',hex:'9400d3',r:148,g:0,b:211},{name:'darkorchid',hex:'9932cc',r:153,g:50,b:204},{name:'darkmagenta',hex:'8b008b',r:139,g:0,b:139},{name:'indigo',hex:'4b0082',r:75,g:0,b:130},{name:'slateblue',hex:'6a5acd',r:106,g:90,b:205},{name:'darkslateblue',hex:'483d8b',r:72,g:61,b:139},{name:'mediumslateblue',hex:'7b68ee',r:123,g:104,b:238},{name:'greenyellow',hex:'adff2f',r:173,g:255,b:47},{name:'chartreuse',hex:'7fff00',r:127,g:255,b:0},{name:'lawngreen',hex:'7cfc00',r:124,g:252,b:0},{name:'lime',hex:'00ff00',r:0,g:255,b:0},{name:'limegreen',hex:'32cd32',r:50,g:205,b:50},{name:'palegreen',hex:'98fb98',r:152,g:251,b:152},{name:'lightgreen',hex:'90ee90',r:144,g:238,b:144},{name:'mediumspringgreen',hex:'00fa9a',r:0,g:250,b:154},{name:'springgreen',hex:'00ff7f',r:0,g:255,b:127},{name:'mediumseagreen',hex:'3cb371',r:60,g:179,b:113},{name:'seagreen',hex:'2e8b57',r:46,g:139,b:87},{name:'forestgreen',hex:'228b22',r:34,g:139,b:34},{name:'green',hex:'008000',r:0,g:128,b:0},{name:'darkgreen',hex:'006400',r:0,g:100,b:0},{name:'yellowgreen',hex:'9acd32',r:154,g:205,b:50},{name:'olivedrab',hex:'6b8e23',r:107,g:142,b:35},{name:'darkolivegreen',hex:'556b2f',r:85,g:107,b:47},{name:'mediumaquamarine',hex:'66cdaa',r:102,g:205,b:170},{name:'darkseagreen',hex:'8fbc8f',r:143,g:188,b:143},{name:'lightseagreen',hex:'20b2aa',r:32,g:178,b:170},{name:'darkcyan',hex:'008b8b',r:0,g:139,b:139},{name:'teal',hex:'008080',r:0,g:128,b:128},{name:'cyan',hex:'00ffff',r:0,g:255,b:255},{name:'lightcyan',hex:'e0ffff',r:224,g:255,b:255},{name:'paleturquoise',hex:'afeeee',r:175,g:238,b:238},{name:'aquamarine',hex:'7fffd4',r:127,g:255,b:212},{name:'turquoise',hex:'40e0d0',r:64,g:224,b:208},{name:'mediumturquoise',hex:'48d1cc',r:72,g:209,b:204},{name:'darkturquoise',hex:'00ced1',r:0,g:206,b:209},{name:'cadetblue',hex:'5f9ea0',r:95,g:158,b:160},{name:'steelblue',hex:'4682b4',r:70,g:130,b:180},{name:'lightsteelblue',hex:'b0c4de',r:176,g:196,b:222},{name:'powderblue',hex:'b0e0e6',r:176,g:224,b:230},{name:'lightblue',hex:'add8e6',r:173,g:216,b:230},{name:'skyblue',hex:'87ceeb',r:135,g:206,b:235},{name:'lightskyblue',hex:'87cefa',r:135,g:206,b:250},{name:'deepskyblue',hex:'00bfff',r:0,g:191,b:255},{name:'dodgerblue',hex:'1e90ff',r:30,g:144,b:255},{name:'cornflowerblue',hex:'6495ed',r:100,g:149,b:237},{name:'royalblue',hex:'4169e1',r:65,g:105,b:225},{name:'blue',hex:'0000ff',r:0,g:0,b:255},{name:'mediumblue',hex:'0000cd',r:0,g:0,b:205},{name:'darkblue',hex:'00008b',r:0,g:0,b:139},{name:'navy',hex:'000080',r:0,g:0,b:128},{name:'cornsilk',hex:'fff8dc',r:255,g:248,b:220},{name:'blanchedalmond',hex:'ffebcd',r:255,g:235,b:205},{name:'bisque',hex:'ffe4c4',r:255,g:228,b:196},{name:'navajowhite',hex:'ffdead',r:255,g:222,b:173},{name:'wheat',hex:'f5deb3',r:245,g:222,b:179},{name:'burlywood',hex:'deb887',r:222,g:184,b:135},{name:'tan',hex:'d2b48c',r:210,g:180,b:140},{name:'rosybrown',hex:'bc8f8f',r:188,g:143,b:143},{name:'sandybrown',hex:'f4a460',r:244,g:164,b:96},{name:'goldenrod',hex:'daa520',r:218,g:165,b:32},{name:'darkgoldenrod',hex:'b8860b',r:184,g:134,b:11},{name:'peru',hex:'cd853f',r:205,g:133,b:63},{name:'chocolate',hex:'d2691e',r:210,g:105,b:30},{name:'saddlebrown',hex:'8b4513',r:139,g:69,b:19},{name:'sienna',hex:'a0522d',r:160,g:82,b:45},{name:'brown',hex:'a52a2a',r:165,g:42,b:42},{name:'white',hex:'ffffff',r:255,g:255,b:255},{name:'snow',hex:'fffafa',r:255,g:250,b:250},{name:'honeydew',hex:'f0fff0',r:240,g:255,b:240},{name:'mintcream',hex:'f5fffa',r:245,g:255,b:250},{name:'azure',hex:'f0ffff',r:240,g:255,b:255},{name:'aliceblue',hex:'f0f8ff',r:240,g:248,b:255},{name:'ghostwhite',hex:'f8f8ff',r:248,g:248,b:255},{name:'whitesmoke',hex:'f5f5f5',r:245,g:245,b:245},{name:'seashell',hex:'fff5ee',r:255,g:245,b:238},{name:'beige',hex:'f5f5dc',r:245,g:245,b:220},{name:'oldlace',hex:'fdf5e6',r:253,g:245,b:230},{name:'floralwhite',hex:'fffaf0',r:255,g:250,b:240},{name:'ivory',hex:'fffff0',r:255,g:255,b:240},{name:'antiquewhite',hex:'faebd7',r:250,g:235,b:215},{name:'linen',hex:'faf0e6',r:250,g:240,b:230},{name:'lavenderblush',hex:'fff0f5',r:255,g:240,b:245},{name:'mistyrose',hex:'ffe4e1',r:255,g:228,b:225},{name:'gainsboro',hex:'dcdcdc',r:220,g:220,b:220},{name:'lightgray',hex:'d3d3d3',r:211,g:211,b:211},{name:'silver',hex:'c0c0c0',r:192,g:192,b:192},{name:'darkgray',hex:'a9a9a9',r:169,g:169,b:169},{name:'darkslategray',hex:'2f4f4f',r:47,g:79,b:79},{name:'black',hex:'000000',r:0,g:0,b:0}];
  }
  find(r, g, b) {
    var _min = Infinity;
    var elt = this.Colors[this.Colors.length - 1];
    for (var i = 0; i < this.Colors.length; i++) {
      var d = Math.sqrt(Math.pow(r - this.Colors[i].r, 2) + Math.pow(g - this.Colors[i].g, 2) + Math.pow(b - this.Colors[i].b, 2));
      if (d < _min) {
        _min = d;
        elt = this.Colors[i];
      }
    }
    return elt;
  }
  get(r, g, b) {
    for (var i = 0; i < this.Colors.length; i++) {
      if (this.Colors[i].r == r && this.Colors[i].g == g && this.Colors[i].b == b) {
        return this.Colors[i];
      }
    }
    return false;
  }
}
class CSGLSquare {
  constructor(canvas, channel, amount, web) {
    if (typeof channel === 'undefined') channel = 0;
    if (typeof amount === 'undefined') amount = 0;
    if (typeof web === 'undefined') web = 0;
    this.Canvas = canvas;
    this.gl = this.Canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!this.gl) {
      console.log('WebGL not supported');
      return;
    }
    this.Program = this.gl.createProgram();
    this.VertexShader = this.createShader(this.gl.VERTEX_SHADER, squareVert);
    this.FragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, squareFrag);
    this.gl.linkProgram(this.Program);
    this.PositionLocation = this.gl.getAttribLocation(this.Program, 'a_position');
    this.TexCoordLocation = this.gl.getAttribLocation(this.Program, 'a_texCoord');
    this.PositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.PositionBuffer);
    this.setRectangle(0, 0, this.Canvas.width, this.Canvas.height);
    this.TexCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TexCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), this.gl.STATIC_DRAW);
    this.AmountLocation = this.gl.getUniformLocation(this.Program, "u_amount");
    this.ChannelLocation = this.gl.getUniformLocation(this.Program, "u_channel");
    this.WebLocation = this.gl.getUniformLocation(this.Program, "u_web");
    this.ResolutionLocation = this.gl.getUniformLocation(this.Program, "u_resolution");
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.clear();
    this.gl.useProgram(this.Program);
    this.gl.enableVertexAttribArray(this.PositionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.PositionBuffer);
    this.gl.vertexAttribPointer(this.PositionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.TexCoordLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TexCoordBuffer);
    this.gl.vertexAttribPointer(this.TexCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform2f(this.ResolutionLocation, this.gl.canvas.width, this.gl.canvas.height);
    this.update(channel, amount, web);
  }
  discard(){
    this.gl.getExtension('WEBGL_lose_context').loseContext()
  }
  draw() {
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    this.gl.drawArrays(primitiveType, offset, count);
  }
  update(channel, amount, web) {
    this.gl.uniform1i(this.ChannelLocation, channel);
    this.gl.uniform1f(this.AmountLocation, amount);
    this.gl.uniform1i(this.WebLocation, web);
    this.draw();
  }
  clear() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
  setRectangle(x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), this.gl.STATIC_DRAW);
  }
  createShader(type, code) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, code);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(code);
      throw 'Compile error: ' + this.gl.getShaderInfoLog(shader);
    }
    this.gl.attachShader(this.Program, shader);
    return shader;
  }
}
class CSGLBar {
  constructor(canvas, channel, amount, web) {
    if (typeof channel === 'undefined') channel = 0;
    if (typeof amount === 'undefined') amount = [0,0];
    if (typeof web === 'undefined') web = 0;
    this.Canvas = canvas;
    this.gl = this.Canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!this.gl) {
      console.log('WebGL not supported');
      return;
    }
    this.Program = this.gl.createProgram();
    this.VertexShader = this.createShader(this.gl.VERTEX_SHADER, barVert)
    this.FragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, barFrag);
    this.gl.linkProgram(this.Program);
    this.PositionLocation = this.gl.getAttribLocation(this.Program, 'a_position');
    this.TexCoordLocation = this.gl.getAttribLocation(this.Program, 'a_texCoord');
    this.PositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.PositionBuffer);
    this.setRectangle(0, 0, this.Canvas.width, this.Canvas.height);
    this.TexCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TexCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), this.gl.STATIC_DRAW);
    this.AmountLocation = this.gl.getUniformLocation(this.Program, "u_amount");
    this.ChannelLocation = this.gl.getUniformLocation(this.Program, "u_channel");
    this.WebLocation = this.gl.getUniformLocation(this.Program, "u_web");
    this.ResolutionLocation = this.gl.getUniformLocation(this.Program, "u_resolution");
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.clear();
    this.gl.useProgram(this.Program);
    this.gl.enableVertexAttribArray(this.PositionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.PositionBuffer);
    this.gl.vertexAttribPointer(this.PositionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.TexCoordLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TexCoordBuffer);
    this.gl.vertexAttribPointer(this.TexCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform2f(this.ResolutionLocation, this.gl.canvas.width, this.gl.canvas.height);
    this.update(channel, amount, web);
  }
  discard(){
    this.gl.getExtension('WEBGL_lose_context').loseContext()
  }
  draw() {
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    this.gl.drawArrays(primitiveType, offset, count);
  }
  update(channel, amount, web) {
    this.gl.uniform1i(this.ChannelLocation, channel);
    this.gl.uniform2fv(this.AmountLocation, amount);
    this.gl.uniform1i(this.WebLocation, web);
    this.draw();
  }
  clear() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
  setRectangle(x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), this.gl.STATIC_DRAW);
  }
  createShader(type, code) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, code);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(code);
      throw 'Compile error: ' + this.gl.getShaderInfoLog(shader);
    }
    this.gl.attachShader(this.Program, shader);
    return shader;
  }
}
class CSGLSquareDragger {
  constructor(selector,x,y, onchange) {
    var self = this;
    if (typeof onchange !== 'function') {
      this.onChange = function (x, y) {
        console.log([x,y]);
      }
    } else this.onChange = onchange;
    this.Offset = {X:7, Y:7};
    this.Max = {X:262, Y:262};
    this.Square = $(selector);
    this.Square.data('dragger', this);
    this.Circle = this.Square.children('circle');
    this.StartX = 0;
    this.StartY = 0;
    this.X = x;
    this.Y = y;
    this.Circle.attr('cx', Math.round(this.X + this.Offset.X));
    this.Circle.attr('cy', Math.round(this.Y + this.Offset.Y));
    self.onChange(this.X, this.Y);
    this.IsDown = false;
    this.Square.on('mousedown', function (e) {
      self.IsDown = true;
      self.StartX = e.pageX - self.Square.offset().left;
      self.StartY = e.pageY - self.Square.offset().top;
      if (self.StartX < self.Offset.X) self.StartX = self.Offset.X;
      if (self.StartY < self.Offset.Y) self.StartY = self.Offset.Y;
      if (self.StartX > self.Max.X) self.StartX = self.Max.X;
      if (self.StartY > self.Max.Y) self.StartY = self.Max.Y;
      self.X = self.StartX - self.Offset.X;
      self.Y = self.StartY - self.Offset.Y;
      self.Circle.attr('cx', Math.round(self.StartX));
      self.Circle.attr('cy', Math.round(self.StartY));
      self.onChange(self.X, self.Y);
      $(document).on('mousemove', function(e) {
        if (self.IsDown) {
          var posX = e.pageX - self.Square.offset().left;
          var posY = e.pageY - self.Square.offset().top;
          if (posX < self.Offset.X) posX = self.Offset.X;
          if (posY < self.Offset.Y) posY = self.Offset.Y;
          if (posX > self.Max.X) posX = self.Max.X;
          if (posY > self.Max.Y) posY = self.Max.Y;
          self.X = posX - self.Offset.X;
          self.Y = posY - self.Offset.Y;
          self.Circle.attr('cx', Math.round(posX));
          self.Circle.attr('cy', Math.round(posY));
          self.onChange(self.X, self.Y);
        }
      });
      $(document).on('mouseup', function() {
        self.IsDown = false;
        $(document).off('mousemove');
        $(document).off('mouseup');
      });
      return false;
    });
  }
  valX() {
    return this.X;
  }
  valY() {
    return this.Y;
  }
  update(x, y) {
    console.log('CSGLSquareDragger.update');
    x=Math.min(Math.max(x,0),255);
    y=Math.min(Math.max(y,0),255);
    this.Y = y;
    this.X = x;
    this.Circle.attr('cx', Math.round(this.X + this.Offset.X));
    this.Circle.attr('cy', Math.round(this.Y + this.Offset.Y));
    this.onChange(x,y);
  }
}
class CSGLBarDragger {
  constructor(selector,Y, onchange) {
    var self = this;
    if (typeof onchange !== 'function') {
      this.onChange = function (y) {
        console.log(y);
      }
    } else this.onChange = onchange;
    this.Offset = {Y:0};
    this.Max = {Y:255};
    this.Bar = $(selector);
    this.Bar.data('dragger', this);
    this.Dragger = this.Bar.children('div');
    this.StartY = 0;
    this.Y = Y;
    this.Dragger.css('top', Math.round(this.Y));
    self.onChange(255-this.Y);
    this.IsDown = false;
    this.Bar.on('mousedown', function (e) {
      self.IsDown = true;
      self.StartY = e.pageY - self.Bar.offset().top-5;
      if (self.StartY < self.Offset.Y) self.StartY = self.Offset.Y;
      if (self.StartY > self.Max.Y) self.StartY = self.Max.Y;
      self.Y = self.StartY;
      self.Dragger.css('top', Math.round(self.StartY));
      self.onChange(255-self.Y);
      $(document).on('mousemove', function(e) {
        if (self.IsDown) {
          var posY = e.pageY - self.Bar.offset().top-5;
          if (posY < self.Offset.Y) posY = self.Offset.Y;
          if (posY > self.Max.Y) posY = self.Max.Y;
          self.Y = posY;
          self.Dragger.css('top', Math.round(posY));
          self.onChange(255-self.Y);
        }
      });
      $(document).on('mouseup', function() {
        self.IsDown = false;
        $(document).off('mousemove');
        $(document).off('mouseup');
      });
      return false;
    });
  }
  update(y) {
    console.log('CSGLBarDragger.update');
    y=Math.min(Math.max(y,0),255);
    this.Y = 255-y;
    this.Dragger.css('top', Math.round(this.Y));
    this.onChange(y);
  }
  val() {
    return 255-this.Y;
  }
}
export class ColorSelector {
  constructor() {
    var self = this;
    let matches = getComputedStyle($('#csactive')[0])['background-color'].match(/(?<=\().*(?=\))/g)
    let rgb = matches[0].split(',').map(item=>Number(item.trim()))
    this.rgb = {r:rgb[0],g:rgb[1],b:rgb[2]}
    this.hsb = this.rgbToHsb(this.rgb)
    this.lab = this.rgbToLab(this.rgb)
    this.cmyk = this.rgbToCmyk(this.rgb);
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

    // let rgb = {r:255,g:255,b:255}
    // let hsb = this.rgbToHsb(rgb)
    // console.log(this.hsbToRgb(hsb.h/360,hsb.s/100,hsb.b/100))
    // let lab = this.rgbToLab(rgb)
    // console.log(this.labToRgb(lab.l,lab.a,lab.b))
    // let cmyk = this.rgbToCmyk(rgb)
    // console.log(this.cmykToRgb(cmyk))
  }
  discard(){
    this.Square.discard()
    this.Bar.discard()
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
    // console.log('updateInputs');
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
  labToRgb(l, a, _b) {//D65
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
  rgbToLab(rgb) {//D65
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