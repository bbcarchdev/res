function SnowStorm(options) {
  this.opt = options;
  this.flakes = [];
  this.setDrift(0);
}

$.extend(SnowStorm.prototype, {
  setDrift: function(n) {
    this.drift = n;
  },

  makeFlake: function() {
    return {
      x: Math.random(),
      y: 0,
      v: (1 + Math.random()) / 200,
      r: Math.random() * Math.random() * 2 + 2
    };
  },

  update: function() {
    var flakes = [];

    for (var i = 0; i < this.flakes.length; i++) {
      var flake = this.flakes[i];
      flake.y += flake.v / flake.r;
      if (flake.y >= 1.0) continue;
      flake.x += this.drift / 20 / flake.r;
      if (flake.x < 0)
        flake.x += 1.0;
      if (flake.x > 1.0)
        flake.x -= 1.0;
      flake.v *= this.opt.gravity;
      flakes.push(flake);
    }

    var need = Math.min(this.opt.birthRate, this.opt.flakes -
      flakes.length);
    for (var i = 0; i < need; i++) {
      flakes.push(this.makeFlake());
    }

    this.flakes = flakes;
  },

  redraw: function(ctx) {
    this.update();

    var flakes = this.flakes;
    var cw = ctx.canvas.width;
    var ch = ctx.canvas.height;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    for (var i = 0; i < flakes.length; i++) {
      var flake = flakes[i];
      ctx.beginPath();
      ctx.arc(flake.x * cw, flake.y * ch, flake.r, 0, 2 * Math.PI,
        false);
      ctx.fill();
    }

    ctx.restore();
  }
});


