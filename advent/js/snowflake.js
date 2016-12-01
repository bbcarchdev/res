function SnowFlake(options) {
  this.opt = $.extend({}, {
    minLength: 0.05,
    branchiness: 6,
    oneBranch: false
  }, options || {});

  this.rotate = 0;
  this.branches = this.makeBranch(1, 1, 1);

  console.log(this.branches);
}

$.extend(SnowFlake.prototype, (function() {

  function around(centre, spread, rolloff) {
    var rand = spread * Math.pow(Math.random(), rolloff);
    return Math.random() < 0.5 ? centre + rand : centre - rand;
  }

  function rgba(r, g, b, a) {
    return "rgba(" + [].slice.call(arguments).join(", ") + ")";
  }

  return {
    spinBy: function(angle) {
      this.rotate += angle;
    },

    makeBranch: function(depth, minLength, maxLength) {
      var length = Math.random() * (maxLength - minLength) + minLength;
      if (length < this.opt.minLength) return;
      var nBranch = Math.floor(1 + Math.random() * this.opt.branchiness / depth);
      var branches = [];
      for (var b = 0; b < nBranch; b++) {
        var br = this.makeBranch(depth + 1, length / 4, length / 1.5);
        if (br) branches.push({
            branch: br
          });
      }
      for (var i = 0; i < branches.length; i++) {
        var br = branches[i];
        var step = length / (branches.length + 1);
        br.pos = around(step * (i + 1), step / 3, 2);
        br.angle = around(Math.PI / 4, Math.PI / 6, 1);
      }
      return {
        length: length,
        branches: branches,
        depth: depth
      };

    },

    renderBranch: function(ctx, branch) {
      ctx.save();

      ctx.lineWidth = branch.length / 30;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(branch.length, 0);
      ctx.stroke();

      for (var i = 0; i < branch.branches.length; i++) {
        var br = branch.branches[i];
        ctx.save();
        ctx.translate(br.pos, 0);

        ctx.save();
        ctx.rotate(br.angle);
        this.renderBranch(ctx, br.branch);
        ctx.restore();

        if (!this.opt.oneBranch) {
          ctx.save();
          ctx.rotate(-br.angle);
          this.renderBranch(ctx, br.branch);
          ctx.restore();
        }

        ctx.restore();
      }

      ctx.restore();
    },

    render: function(ctx) {
      // Render the snowflake
      ctx.save();
      ctx.lineCap = "round";
      ctx.rotate(this.rotate);
      var rep = this.opt.oneBranch ? 1 : 6;
      for (var i = 0; i < rep; i++) {
        this.renderBranch(ctx, this.branches);
        ctx.rotate(Math.PI / 3);
      }
      ctx.restore();
    }
  };
})());


