<template>
  <div class="w-full h-full" style="background: #2b2b2b">
    <canvas v-resize="resize" class="timeShaft" ref="timeShaft"></canvas>
    <div style="padding: 0 30px">
      <el-slider v-model="value" :min="1" :max="100" :step="1" @input="input"></el-slider>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: 1,
      arr: [
        500000,
        200000,
        100000,
        50000,
        20000,
        10000,
        5000,
        2000,
        1000,
        500,
        200,
        100,
        50,
        20,
        10,
        5,
        2,
        1,
      ],
      duration: 2.5 * 60 * 1000,
      left: 0,
      rateX: 0.5,
      font: "12px",
      gap: 20, //文字之间的最小间隙
      middle: 3, //中刻度
      short: 1, //短刻度
      long: 5, //长刻度
      bottom: 8, //文字到底部距离
    };
  },
  mounted() {
    this.cvs = this.$refs["timeShaft"];
    this.mousemove = {
      offsetX: this.cvs.width * this.rateX,
      offsetY: this.cvs.height * this.rateX,
    };
    this.cvs.addEventListener("mousemove", (evt) => {
      this.rateX =
        (this.cvs.width * this.value * this.rateX -
          this.mousemove.offsetX +
          evt.offsetX) /
        (this.cvs.width * this.value);
      this.mousemove = { offsetX: evt.offsetX, offsetY: evt.offsetY };
      this.draw();
    });
  },
  methods: {
    resize() {
      let box = this.cvs.getBoundingClientRect();
      this.cvs.width = box.width;
      this.cvs.height = box.height;
      this.mousemove = {
        offsetX: this.cvs.width * this.rateX,
        offsetY: this.cvs.height * this.rateX,
      };
      this.draw();
    },
    input(value) {
      let tmp = -(this.rateX * this.cvs.width * value - this.mousemove.offsetX);
      if (tmp > 0) {
        this.left = 0;
        this.mousemove.offsetX = this.rateX * this.cvs.width * value + this.left;
      } else if (tmp < this.cvs.width - this.cvs.width * value) {
        this.left = this.cvs.width - this.cvs.width * value;
        this.mousemove.offsetX = this.rateX * this.cvs.width * value + this.left;
      }
      if (this.mousemove.offsetX < this.cvs.width / 2) {
        let tmpLeft = 0;
        let tmpOffsetX = this.rateX * this.cvs.width * value + tmpLeft;
        if (tmpOffsetX < this.cvs.width / 2) {
          this.left = tmpLeft;
          this.mousemove.offsetX = tmpOffsetX;
        } else {
          this.mousemove.offsetX = this.cvs.width / 2;
          this.left = -(this.rateX * this.cvs.width * value - this.mousemove.offsetX);
        }
      } else if (this.mousemove.offsetX > this.cvs.width / 2) {
        let tmpLeft = this.cvs.width - this.cvs.width * value;
        let tmpOffsetX = this.rateX * this.cvs.width * value + tmpLeft;
        if (tmpOffsetX > this.cvs.width / 2) {
          this.left = tmpLeft;
          this.mousemove.offsetX = tmpOffsetX;
        } else {
          this.mousemove.offsetX = this.cvs.width / 2;
          this.left = -(this.rateX * this.cvs.width * value - this.mousemove.offsetX);
        }
      } else {
        this.left = tmp;
      }
      this.draw();
    },
    draw() {
      let ctx = this.cvs.getContext("2d");
      ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.fillStyle = "white";
      ctx.font = this.font;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      // ctx.fillRect(0,0,this.cvs.width,this.cvs.height)
      // ctx.strokeRect(0,0,this.cvs.width,this.cvs.height)
      ctx.strokeStyle = "white";
      let tmpIndex = this.arr.length,
        step,
        Num,
        delta,
        minDelta,
        text_width;
      while (
        tmpIndex === this.arr.length ||
        (delta < text_width + this.gap && this.arr[tmpIndex - 1])
      ) {
        step = this.arr[--tmpIndex];
        Num = this.duration / step;
        delta = (this.cvs.width * this.value) / Num;
        minDelta = delta / 10;
        text_width = ctx.measureText("000:00.000").width;
      }
      for (
        let i = Math.max(0, -Math.floor(this.left / delta + 1));
        i < Math.min(Num + 1, (this.cvs.width - this.left) / delta + 1);
        i++
      ) {
        ctx.fillText(
          this.format(i * step),
          this.left + delta * i,
          this.cvs.height - this.bottom
        );
        ctx.beginPath();
        ctx.moveTo(this.left + delta * i, this.cvs.height);
        ctx.lineTo(this.left + delta * i, this.cvs.height - this.long);
        ctx.stroke();
        for (let j = 1; i < Num && j < 10; j++) {
          ctx.beginPath();
          if (j === 5) {
            ctx.moveTo(this.left + delta * i + minDelta * j, this.cvs.height);
            ctx.lineTo(
              this.left + delta * i + minDelta * j,
              this.cvs.height - this.middle
            );
          } else {
            ctx.moveTo(this.left + delta * i + minDelta * j, this.cvs.height);
            ctx.lineTo(
              this.left + delta * i + minDelta * j,
              this.cvs.height - this.short
            );
          }
          ctx.stroke();
        }
      }
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(this.mousemove.offsetX, 0);
      ctx.lineTo(this.mousemove.offsetX, this.cvs.height);
      ctx.stroke();
      ctx.restore();
    },
    format(v) {
      let minute = Math.floor(v / (60 * 1000));
      let second = Math.floor(v / 1000) % 60;
      let millisecond = Math.floor(v % 1000);
      return (
        minute.toString().padStart(3, "0") +
        ":" +
        second.toString().padStart(2, "0") +
        "." +
        millisecond.toString().padStart(3, "0")
      );
    },
  },
};
</script>
<style scoped>
.timeShaft {
  min-width: 800px;
  width: 100%;
  height: 30px;
  background: #646464;
}
</style>
